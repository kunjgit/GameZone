import { Trick } from "@/models/trick";
import { RingQueue } from "@/models/ringQueue";
import { Score } from "@/models/score";
import { options } from "@/models/options";
import { notifier } from "@/models/notifier";
import { extras } from "@/models/extras";
import { PartyName, findParties, Party } from "@/models/party";
import { Player } from "./player";
import { Scorecard } from "./scorecard";
import { findGameType, GameType } from "./reservations";

export enum RoundState {
  AskingForReservations,
  Started,
  Finished,
}

export class Round {
  players: Player[];
  parties: { [name: string]: Party };
  scorecard: Scorecard;
  score?: Score;
  roundState: RoundState;
  gameType?: GameType;
  previousTrick?: Trick;
  currentTrick: Trick;
  playerOrder: RingQueue<Player>;

  constructor(
    players: Player[] = [],
    scorecard: any = {},
    openingPlayer: Player
  ) {
    this.players = players; // TODO: remove - we don't need both, a list of players and a RingQueue of players
    this.playerOrder = new RingQueue(players);
    this.playerOrder.prioritize(openingPlayer);
    this.parties = findParties(players);
    this.scorecard = scorecard;
    this.score = undefined;
    this.roundState = RoundState.AskingForReservations;
    this.currentTrick = this.nextTrick();
  }

  startRound() {
    if (this.roundState !== RoundState.AskingForReservations) {
      return;
    }

    this.playerOrder.asList().forEach((p) => p.promptForReservation());

    const gameType = findGameType(this.playerOrder);
    this.gameType = gameType;
    this.roundState = RoundState.Started;

    // send notification ("alle gesund", "Hubert spielt ein Solo")
    // sort cards on hand

    // set trumps for current round

    this.nextMove();
  }

  nextTrick() {
    this.previousTrick = this.currentTrick;
    const trick = new Trick(this.playerOrder.asList());
    if (this.cardsLeft() <= this.playerOrder.length()) {
      trick.setLastTrickInRound();
    }
    return trick;
  }

  nextPlayer() {
    this.playerOrder.next();
  }

  waitingForPlayer() {
    return this.playerOrder.current();
  }

  async nextMove() {
    if (this.waitingForPlayer().isHuman) {
      return;
    }

    if (this.currentTrick.isFinished() || this.isFinished()) {
      return;
    }

    await this.waitingForPlayer().autoplay();
  }

  noMoreCardsLeft() {
    return this.cardsLeft() === 0;
  }

  cardsLeft() {
    const sumCardsFn = (acc: number, player: Player) => acc + player.numberOfCardsLeft();
    return this.playerOrder.asList().reduce(sumCardsFn, 0);
  }

  isFinished() {
    return this.roundState === RoundState.Finished;
  }

  async finishTrick() {
    await this.evaluateLatestTrick();

    this.currentTrick = this.nextTrick();

    if (options.autoplay === true) {
      this.nextMove();
    }
  }

  async evaluateLatestTrick() {
    const winner = this.currentTrick.winner();

    if (!winner) {
      return;
    }

    // TODO: remove this, migrate to an event-based approach (see comment in trick.ts)
    this.playerOrder
      .asList()
      .forEach((player) =>
        player.memory.memorizeTrick(
          this.currentTrick.id,
          this.currentTrick.baseCard()!,
          winner
        )
      );

    winner.win(this.currentTrick);
    this.playerOrder.prioritize(winner);
    await this.showExtras();
  }

  async showExtras() {
    for (const extra of this.currentTrick.extras()) {
      switch (extra) {
        case extras.doppelkopf:
          // todo i18n
          await notifier.flash("Doppelkopf");
          break;
      }
    }
  }

  async finishRound() {
    if (!this.noMoreCardsLeft()) {
      throw new Error(`Can't finish a round before all cards have been played`);
    }

    await this.evaluateLatestTrick();

    this.currentTrick = this.nextTrick();

    this.parties = findParties(this.players);
    this.score = new Score(
      this.parties[PartyName.Re],
      this.parties[PartyName.Kontra]
    );
    this.scorecard.addScore(this.score);
    this.roundState = RoundState.Finished;
  }
}
