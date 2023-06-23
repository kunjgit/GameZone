import { chance } from "@/models/random";
import { PlayedCard } from "@/models/playedCard";
import { Card, cardOrder, Suit } from "@/models/card";
import { Hand } from "./hand";
import { Player } from "./player";

interface MemorizedCard {
  playedCard: PlayedCard;
  trickId?: string;
}

interface MemorizedTrick {
  trickId: string;
  baseCard: Card;
  winner: Player;
}

export abstract class Memory {
  memorizedCards: MemorizedCard[];
  memorizedTricks: MemorizedTrick[];

  constructor() {
    this.memorizedCards = [];
    this.memorizedTricks = [];
  }

  isHighestCardLeft(card: Card, hand?: Hand): boolean {
    let allKnownCards = [
      ...this.memorizedCards.map((mcard) => mcard.playedCard.card),
      ...(hand?.cards || []),
    ];
    let leftOverCards = cardOrder.filter(
      (x) => !allKnownCards.some((y) => x.equals(y))
    );
    return leftOverCards.length > 0 && card.compareTo(leftOverCards[0]) <= 0;
  }

  clearMemory() {
    this.memorizedCards = [];
  }

  abstract memorize(playedCard: PlayedCard, trickId?: string): void;

  memorizeMany(playedCards: PlayedCard[], trickId?: string): void {
    playedCards.forEach((playedCard) => this.memorize(playedCard, trickId));
  }

  memorizeTrick(trickId: string, baseCard: Card, winner: Player): void {
    this.memorizedTricks.push({ trickId, baseCard, winner });
  }

  hasSuitBeenStartedBefore(suit: Suit): boolean {
    return (
      this.memorizedTricks.filter(
        (memTrick) =>
          memTrick.baseCard.suit === suit && !memTrick.baseCard.isTrump()
      ).length > 0
    );
  }

  hasSuitBeenThrown(suit: Suit): boolean {
    return (
      this.hasSuitBeenPlayedBefore(suit) && !this.hasSuitBeenStartedBefore(suit)
    );
  }

  hasSuitBeenThrownByPlayer(suit: Suit, player: Player): boolean {
    return (
      this.hasSuitBeenThrown(suit) &&
      this.getPlayersBySuitPlayed(suit)
        .map((p) => p.id)
        .includes(player.id)
    );
  }

  hasSuitBeenPlayedBefore(suit: Suit, trickId?: string): boolean {
    return this.getPlayersBySuitPlayed(suit, trickId).length > 0;
  }

  getPlayersBySuitPlayed(suit: Suit, trickId?: string): Player[] {
    return this.memorizedCards
      .filter(
        (memCards) =>
          memCards.playedCard.card.suit === suit &&
          !memCards.playedCard.card.isTrump() &&
          (memCards.trickId !== trickId || !trickId)
      )
      .map((memCards) => memCards.playedCard.player);
  }

  pointsForPlayer(player: Player): number {
    let points = 0;
    this.memorizedTricks.forEach((trick) => {
      if (trick.winner.id === player.id) {
        points += this.memorizedCards
          .filter((card) => card.trickId === trick.trickId)
          .reduce((accu, memCard) => accu + memCard.playedCard.card.value, 0);
      }
    });
    return points;
  }

  pointsLeftInSuit(suit: string): number {
    return (
      cardOrder
        .filter((card) => card.suit === suit && !card.isTrump())
        .reduce((accu, card) => accu + card.value, 0) -
      this.memorizedCards
        .filter(
          (element) =>
            element.playedCard.card.suit === suit &&
            !element.playedCard.card.isTrump()
        )
        .reduce((accu, element) => accu + element.playedCard.card.value, 0)
    );
  }
}

export class PercentageMemory extends Memory {
  percentage: number;

  constructor(percentage: number) {
    super();
    this.percentage = percentage;
  }

  /**
   * Will memorize the card by the percentage set in the constructor
   * @param {PlayedCard} playedCard - The card and the player who has played it
   * @param {string} trickId - The trick Identifier the card was played in
   */
  memorize(playedCard: PlayedCard, trickId?: string) {
    if (chance(this.percentage))
      this.memorizedCards.push({ playedCard, trickId });
  }
}

export class PerfectMemory extends Memory {
  constructor() {
    super();
  }

  /**
   * Will memorize all cards
   * @param {PlayedCard} playedCard - The card and the player who has played it
   * @param {string} trickId - The trick Identifier the card was played in
   */
  memorize(playedCard: PlayedCard, trickId?: string) {
    this.memorizedCards.push({ playedCard, trickId });
  }
}

export class PriorityMemory extends Memory {
  constructor() {
    super();
  }

  /**
   * Opinionated function to memorize 'important' cards.
   * Will memorize by value. Only memorizes Queens, Tens, Aces
   * @param {PlayedCard} playedCard - The card and the player who has played it
   * @param {string} trickId - The trick Identifier the card was played in
   */
  memorize(playedCard: PlayedCard, trickId?: string) {
    if ([3, 10, 11].includes(playedCard.card.value))
      this.memorizedCards.push({ playedCard, trickId });
  }
}
