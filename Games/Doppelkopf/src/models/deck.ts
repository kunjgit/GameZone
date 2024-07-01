import { Card, Rank, Suit } from "@/models/card";
import { shuffle } from "@/models/random";
export class Deck {
  cards: Card[];

  constructor() {
    this.cards = shuffle(new Array<Card>().concat(...allCards));
  }
}

export const allCards = Object.values(Rank)
  .map((rank) => [
    new Card(rank, Suit.Clubs, 0),
    new Card(rank, Suit.Spades, 0),
    new Card(rank, Suit.Hearts, 0),
    new Card(rank, Suit.Diamonds, 0),
    new Card(rank, Suit.Clubs, 1),
    new Card(rank, Suit.Spades, 1),
    new Card(rank, Suit.Hearts, 1),
    new Card(rank, Suit.Diamonds, 1),
  ])
  .flat();
