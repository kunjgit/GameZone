export enum Suit {
  Clubs = "♣",
  Spades = "♠",
  Hearts = "♥",
  Diamonds = "♦",
}

export enum Rank {
  Ace = "A",
  Ten = "10",
  King = "K",
  Queen = "Q",
  Jack = "J",
}

export const values: { [id: string]: number } = {
  A: 11,
  "10": 10,
  K: 4,
  Q: 3,
  J: 2,
};

export class Card {
  id: number;
  rank: Rank;
  suit: Suit;

  constructor(rank: Rank, suit = Suit.Clubs, id = 0) {
    this.rank = rank;
    this.suit = suit;
    this.id = id;
  }

  get value() {
    return values[this.rank];
  }

  get cardId() {
    return `${this.rank}-${this.suit}-${this.id}`;
  }

  of(suit: Suit) {
    return new Card(this.rank, suit);
  }

  first() {
    return new Card(this.rank, this.suit, 0);
  }

  second() {
    return new Card(this.rank, this.suit, 1);
  }

  isTrump() {
    return trumps.some((c) => c.is(this));
  }

  /**
   * Explains why this card is a trump card
   * @return {string} the explanation, if trump, or an empty string otherwise
   */
  whyTrump(): string {
    if (this.rank === Rank.Queen) {
      return "queens are always trump";
    }

    if (this.rank === Rank.Jack) {
      return "jacks are always trump";
    }

    if (this.suit === Suit.Diamonds) {
      return "diamonds are always trump";
    }

    if (this.rank === Rank.Ten && this.suit === Suit.Hearts) {
      return "the ten of hearts is always trump";
    }

    return "";
  }

  beats(anotherCard: Card | undefined) {
    if (!anotherCard) {
      return false;
    }

    return this.compareTo(anotherCard) < 0;
  }

  compareTo(anotherCard: Card) {
    const thisIsTrump = this.isTrump();
    const otherCardIsTrump = anotherCard.isTrump();

    if (thisIsTrump && !otherCardIsTrump) {
      return -1;
    }

    if (!thisIsTrump && otherCardIsTrump) {
      return 1;
    }

    if (thisIsTrump && otherCardIsTrump) {
      return (
        trumps.findIndex((c) => c.is(this)) -
        trumps.findIndex((c) => c.is(anotherCard))
      );
    }

    if (!thisIsTrump && !otherCardIsTrump) {
      if (this.suit === anotherCard.suit) {
        return anotherCard.value - this.value;
      }
    }

    return 0;
  }

  equals(anotherCard: Card | undefined) {
    if (!anotherCard) {
      return false;
    }

    return (
      this.rank == anotherCard.rank &&
      this.suit == anotherCard.suit &&
      this.id == anotherCard.id
    );
  }

  is(anotherCard: Card) {
    return this.rank === anotherCard.rank && this.suit === anotherCard.suit;
  }
}

export function compare(oneCard: Card, anotherCard: Card) {
  return (
    cardOrder.findIndex((c) => c.equals(anotherCard)) -
    cardOrder.findIndex((c) => c.equals(oneCard))
  );
}

export function byCardValuesDesc(oneCard: Card, anotherCard: Card) {
  return anotherCard.value - oneCard.value || compare(oneCard, anotherCard);
}

export const ace = new Card(Rank.Ace, Suit.Clubs);
export const ten = new Card(Rank.Ten, Suit.Clubs);
export const king = new Card(Rank.King, Suit.Clubs);
export const queen = new Card(Rank.Queen, Suit.Clubs);
export const jack = new Card(Rank.Jack, Suit.Clubs);

export const trumps = [
  ten.of(Suit.Hearts),
  queen.of(Suit.Clubs),
  queen.of(Suit.Spades),
  queen.of(Suit.Hearts),
  queen.of(Suit.Diamonds),
  jack.of(Suit.Clubs),
  jack.of(Suit.Spades),
  jack.of(Suit.Hearts),
  jack.of(Suit.Diamonds),
  ace.of(Suit.Diamonds),
  ten.of(Suit.Diamonds),
  king.of(Suit.Diamonds),
];

export const cardOrder = [
  new Card(Rank.Ten, Suit.Hearts, 0),
  new Card(Rank.Ten, Suit.Hearts, 1),

  new Card(Rank.Queen, Suit.Clubs, 0),
  new Card(Rank.Queen, Suit.Clubs, 1),
  new Card(Rank.Queen, Suit.Spades, 0),
  new Card(Rank.Queen, Suit.Spades, 1),
  new Card(Rank.Queen, Suit.Hearts, 0),
  new Card(Rank.Queen, Suit.Hearts, 1),
  new Card(Rank.Queen, Suit.Diamonds, 0),
  new Card(Rank.Queen, Suit.Diamonds, 1),

  new Card(Rank.Jack, Suit.Clubs, 0),
  new Card(Rank.Jack, Suit.Clubs, 1),
  new Card(Rank.Jack, Suit.Spades, 0),
  new Card(Rank.Jack, Suit.Spades, 1),
  new Card(Rank.Jack, Suit.Hearts, 0),
  new Card(Rank.Jack, Suit.Hearts, 1),
  new Card(Rank.Jack, Suit.Diamonds, 0),
  new Card(Rank.Jack, Suit.Diamonds, 1),

  new Card(Rank.Ace, Suit.Diamonds, 0),
  new Card(Rank.Ace, Suit.Diamonds, 1),
  new Card(Rank.Ten, Suit.Diamonds, 0),
  new Card(Rank.Ten, Suit.Diamonds, 1),
  new Card(Rank.King, Suit.Diamonds, 0),
  new Card(Rank.King, Suit.Diamonds, 1),

  new Card(Rank.Ace, Suit.Clubs, 0),
  new Card(Rank.Ace, Suit.Clubs, 1),
  new Card(Rank.Ten, Suit.Clubs, 0),
  new Card(Rank.Ten, Suit.Clubs, 1),
  new Card(Rank.King, Suit.Clubs, 0),
  new Card(Rank.King, Suit.Clubs, 1),

  new Card(Rank.Ace, Suit.Spades, 0),
  new Card(Rank.Ace, Suit.Spades, 1),
  new Card(Rank.Ten, Suit.Spades, 0),
  new Card(Rank.Ten, Suit.Spades, 1),
  new Card(Rank.King, Suit.Spades, 0),
  new Card(Rank.King, Suit.Spades, 1),

  new Card(Rank.Ace, Suit.Hearts, 0),
  new Card(Rank.Ace, Suit.Hearts, 1),
  new Card(Rank.King, Suit.Hearts, 0),
  new Card(Rank.King, Suit.Hearts, 1),
];
