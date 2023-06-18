import { Round } from "@/models/round";
import { Player } from "@/models/player";
import { Deck } from "@/models/deck";
import { Hand } from "@/models/hand";
import { Scorecard } from "@/models/scorecard";
import { RingQueue } from "@/models/ringQueue";
import { generateNames } from "@/models/random";
import { TablePosition } from "./tablePosition";

export class Game {
  players: Player[];
  private playerOpeningOrder: RingQueue<Player>;
  deck: Deck;
  scorecard: Scorecard;
  currentRound: Round;

  constructor(players: Player[] = []) {
    this.players = players;
    this.players.map((p) => (p.game = this));
    this.playerOpeningOrder = new RingQueue(this.players);
    this.deck = new Deck();
    this.deal();
    this.scorecard = new Scorecard(this.players);
    this.currentRound = new Round(
      this.players,
      this.scorecard,
      this.playerOpeningOrder.current()
    );
    this.initializeAffinities();
  }

  static singlePlayer() {
    const isHuman = true;
    const isComputer = false;
    const randomNames = generateNames(4);
    const playerName = localStorage.getItem("name") || randomNames[0];
    return new Game([
      new Player(playerName, isHuman, true, TablePosition.Bottom),
      new Player(randomNames[1], isComputer, false, TablePosition.Left),
      new Player(randomNames[2], isComputer, false, TablePosition.Top),
      new Player(randomNames[3], isComputer, false, TablePosition.Right),
    ]);
  }

  // todo: make this configurable for playing with 9s
  deal() {
    const hands = [];

    do {
      this.deck = new Deck();
      hands[0] = new Hand(this.deck.cards.slice(0, 10));
      hands[1] = new Hand(this.deck.cards.slice(10, 20));
      hands[2] = new Hand(this.deck.cards.slice(20, 30));
      hands[3] = new Hand(this.deck.cards.slice(30, 40));
    } while (!hands.every((hand) => hand.isPlayable()));

    this.players[0].hand = hands[0];
    this.players[1].hand = hands[1];
    this.players[2].hand = hands[2];
    this.players[3].hand = hands[3];
  }

  get playerOpening() {
    return this.playerOpeningOrder.current();
  }

  get currentTrick() {
    return this.currentRound.currentTrick;
  }

  get previousTrick() {
    return this.currentRound.previousTrick;
  }

  nextRound() {
    this.deal();
    this.currentRound = new Round(
      this.players,
      this.scorecard,
      this.playerOpeningOrder.next()
    );
    this.resetPlayers();
  }

  resetPlayers() {
    this.players.forEach((player) => player.reset());
  }

  initializeAffinities() {
    this.players.forEach((player) =>
      player.behavior.affinities.setPlayers(this.players)
    );
  }
}
