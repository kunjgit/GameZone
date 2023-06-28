import { v4 as uuidv4 } from "uuid";
import { ace, Card, queen, ten } from "@/models/card";
import { PlayedCard } from "@/models/playedCard";
import { Rank, Suit } from "@/models/card";
import { Extra, extras as extrasModel } from "@/models/extras";
import { Player } from "./player";
import { AffinityEvent } from "./affinities";

export class Trick {
  players: Player[];
  playedCards: PlayedCard[];
  id: string;
  lastTrickInRound: boolean;
  finished: boolean;
  private expectedNumberOfCards: number;

  constructor(players: Array<Player>) {
    this.players = players; // TODO: remove 'players' field from 'trick' class to avoid circular dependency
    this.expectedNumberOfCards = players.length;
    this.playedCards = [];
    this.finished = false;
    this.id = uuidv4(); // TODO: once we migrate to vue 3 we can drop all ids (they're only used for `v-for` keys)
    this.lastTrickInRound = false;
  }

  setLastTrickInRound(): void {
    this.lastTrickInRound = true;
  }

  add(card: Card, player: Player): void {
    if (this.cardBy(player)) {
      throw Error(`Player ${player.name} already played a card`);
    }

    const playedCard = new PlayedCard(card, player);

    this.playedCards.push(playedCard);

    if (this.playedCards.length === this.expectedNumberOfCards) {
      this.finished = true;
    }

    // TODO: refactor this (and the affinity event below) so it becomes an event-driven mechanism.
    // playing a card should fire a global event that players (and their behavior) can subscribe to and choose to memorize or not.
    this.players.forEach((playerLoop) => {
      playerLoop.memory.memorize(new PlayedCard(card, player), this.id);
    });

    this.checkForAffinityEvent(card, player);
  }

  checkForAffinityEvent(card: Card, player: Player): void {
    if (card.is(queen.of(Suit.Clubs))) {
      this.players.forEach((p) => {
        p.behavior.handleAffinityEvent(AffinityEvent.QueenOfClubs, player);
      });
    }
    if (this.contains(queen.of(Suit.Clubs))) {
      if (card.is(ten.of(Suit.Hearts))) {
        this.players.forEach((p) => {
          p.behavior.handleAffinityEvent(
            AffinityEvent.QueenOfClubsTricked,
            player
          );
        });
      }
      if (card.is(ace.of(Suit.Diamonds)) || card.is(ten.of(Suit.Diamonds))) {
        this.players.forEach((p) => {
          p.behavior.handleAffinityEvent(
            AffinityEvent.QueenOfClubsGreased,
            player
          );
        });
      }
      // right now affinity check is called after card is pushed to playedcards
      // this might do some trouble when card is queen.of.clubs - keep this in mind
      if (
        this.playedCards.length === 4 &&
        !(card.is(ace.of(Suit.Diamonds)) || card.is(ten.of(Suit.Diamonds)))
      ) {
        this.players.forEach((p) => {
          p.behavior.handleAffinityEvent(
            AffinityEvent.QueenOfClubsNotGreased,
            player
          );
        });
      }
    }
  }

  cards(): PlayedCard[] {
    return this.playedCards;
  }

  cardBy(player: Player): PlayedCard {
    return this.playedCards.filter(
      (playedCard) => playedCard.player.id === player.id
    )[0];
  }

  contains(card: Card): boolean {
    return (
      this.playedCards.filter((playedCard) => playedCard.card.is(card)).length >
      0
    );
  }

  isFinished(): boolean {
    return this.finished;
  }

  baseCard(): Card | undefined {
    return this.playedCards[0]?.card;
  }

  highestCard(): PlayedCard | undefined {
    if (!this.playedCards) {
      return undefined;
    }
    let highestPlayed = this.playedCards[0];
    for (const played of this.playedCards) {
      if (played.card.beats(highestPlayed.card)) {
        highestPlayed = played;
      }
    }
    return highestPlayed;
  }

  winner(): Player | undefined {
    return this.highestCard()?.player;
  }

  points(): number {
    return this.playedCards.reduce(
      (acc, playedCard) => acc + playedCard.card.value,
      0
    );
  }

  // TODO: refactor - move to a new "trickEvaluator" or "extrasCalculator" (or simply "extras"?)
  extras(): Extra[] {
    let extras: Extra[] = [];
    if (this.points() >= 40) {
      extras.push(extrasModel.doppelkopf);
    }
    extras = extras.concat(this.caughtFox());
    extras = extras.concat(this.caughtCharlie());
    if (this.charlie()) {
      extras.push(extrasModel.charlie);
    }
    return extras;
  }

  findFox(): PlayedCard[] {
    return this.playedCards.filter(
      (playedCard) =>
        playedCard.card.rank === Rank.Ace &&
        playedCard.card.suit === Suit.Diamonds
    );
  }

  caughtFox(): Extra[] {
    const extras: Extra[] = [];
    this.findFox().forEach((fox) => {
      const caughtByOtherParty =
        (fox.player.isRe() && !this.winner()?.isRe()) ||
        (fox.player.isKontra() && !this.winner()?.isKontra());
      if (caughtByOtherParty) extras.push(extrasModel.fox);
    });
    return extras;
  }

  findCharlie(): PlayedCard[] {
    return this.playedCards.filter(
      (playedCard) =>
        playedCard.card.rank === Rank.Jack &&
        playedCard.card.suit === Suit.Clubs
    );
  }

  caughtCharlie(): Extra[] {
    const extras: Extra[] = [];
    if (this.lastTrickInRound) {
      this.findCharlie().forEach((charlie) => {
        const caughtCharlie =
          (charlie.player.isRe() && !this.winner()?.isRe()) ||
          (charlie.player.isKontra() && !this.winner()?.isKontra());
        if (caughtCharlie) extras.push(extrasModel.charlie_caught);
      });
    }
    return extras;
  }

  charlie(): boolean {
    const charlies = this.findCharlie();
    if (this.lastTrickInRound && charlies.length > 0) {
      // first charlie has to be highest card in trick
      const charlie = charlies[0];
      const charlie_trump =
        ((charlie.player.isRe() && this.winner()?.isRe() === true) ||
          (charlie.player.isKontra() && this.winner()?.isKontra() === true)) &&
        this.highestCard() === charlie;
      return charlie_trump;
    }
    return false;
  }
}
