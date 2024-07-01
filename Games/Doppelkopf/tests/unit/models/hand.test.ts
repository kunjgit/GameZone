import { Hand } from "@/models/hand";
import {
  Rank,
  Suit,
  ace,
  ten,
  king,
  queen,
  jack,
  cardOrder,
} from "@/models/card";
import { allCards } from "@/models/deck";
import { shuffle } from "@/models/random";

test("a hand with queen of clubs is re", () => {
  const cards = [queen.of(Suit.Clubs)];
  const hand = new Hand(cards);

  expect(hand.isRe()).toBeTruthy();
  expect(hand.isKontra()).toBeFalsy();
});

test("a re hand that played the queen of clubs is still re", () => {
  const queenOfClubs = queen.of(Suit.Clubs);
  const tenOfHearts = ten.of(Suit.Hearts);
  const hand = new Hand([queenOfClubs, tenOfHearts]);

  hand.remove(queenOfClubs);

  expect(hand.isRe()).toBeTruthy();
  expect(hand.isKontra()).toBeFalsy();
});

test("a hand without queen of clubs is kontra", () => {
  const cards = [queen.of(Suit.Spades)];
  const hand = new Hand(cards);

  expect(hand.isKontra()).toBeTruthy();
  expect(hand.isRe()).toBeFalsy();
});

test("hand has a value", () => {
  const cards = [
    queen.of(Suit.Spades),
    ten.of(Suit.Hearts),
    ace.of(Suit.Diamonds),
  ];
  const hand = new Hand(cards);

  expect(hand.value()).toBe(24);
});

test("empty hand has a value of 0", () => {
  const hand = new Hand([]);

  expect(hand.value()).toBe(0);
});

test("can find specific card on hand", () => {
  const queenOfSpades = queen.of(Suit.Spades);
  const cards = [queenOfSpades];
  const hand = new Hand(cards);

  expect(hand.find(cards[0])).toEqual(queenOfSpades);
});

test("can find card on hand by rank and suit", () => {
  const queenOfSpades = queen.of(Suit.Spades);
  const cards = [queenOfSpades];
  const hand = new Hand(cards);

  expect(hand.findAny(Suit.Spades, Rank.Queen)).toEqual(queenOfSpades);
  expect(hand.contains(queenOfSpades)).toBe(true);
});

test("should return empty list if card on hand cannot be found by rank and suit", () => {
  const queenOfSpades = queen.of(Suit.Spades);
  const cards = [queenOfSpades];
  const hand = new Hand(cards);

  expect(hand.findAny(Suit.Spades, Rank.King)).toBeUndefined();
  expect(hand.contains(king.of(Suit.Spades))).toBe(false);
});

test("can not find non-existing card on hand", () => {
  const queenOfSpades = queen.of(Suit.Spades);
  const cards = [queenOfSpades];
  const hand = new Hand(cards);

  expect(hand.find(king.of(Suit.Spades))).toBeUndefined();
});

test("can remove card from hand", () => {
  const cards = [queen.of(Suit.Spades)];
  const hand = new Hand(cards);
  expect(hand.find(cards[0])).toBeDefined();

  hand.remove(cards[0]);

  expect(hand.find(cards[0])).toBeUndefined();
});

test("cannot remove non-existing card from hand", () => {
  const cards = [queen.of(Suit.Spades)];
  const hand = new Hand(cards);
  expect(hand.find(cards[0])).toBeDefined();

  function invalidRemove() {
    hand.remove(king.of(Suit.Diamonds));
  }

  expect(invalidRemove).toThrowError("can't remove card that isn't on hand");
});

test("should sort hand by visual order", () => {
  const cards = allCards;

  const hand = new Hand(shuffle(cards));

  expect(hand.cards).toEqual(cardOrder);
});

test("should detect hand with 5 kings as not playable", () => {
  const cards = [
    king.of(Suit.Hearts),
    ten.of(Suit.Hearts),
    queen.of(Suit.Spades),
    king.of(Suit.Diamonds),
    king.of(Suit.Clubs),
    king.of(Suit.Clubs),
    ten.of(Suit.Spades),
    king.of(Suit.Diamonds),
    queen.of(Suit.Spades),
    queen.of(Suit.Hearts),
  ];
  const hand = new Hand(cards);

  expect(hand.isPlayable()).toBe(false);
});

test("should detect playable hand", () => {
  const cards = [
    king.of(Suit.Hearts),
    ten.of(Suit.Hearts),
    queen.of(Suit.Spades),
    king.of(Suit.Diamonds),
    ace.of(Suit.Clubs),
    ten.of(Suit.Clubs),
    ten.of(Suit.Spades),
    king.of(Suit.Diamonds),
    queen.of(Suit.Spades),
    queen.of(Suit.Hearts),
  ];
  const hand = new Hand(cards);

  expect(hand.isPlayable()).toBe(true);
});

test("should detect hand with more than seven ten point cards", () => {
  const cards = [
    ace.of(Suit.Clubs),
    ten.of(Suit.Clubs),
    ten.of(Suit.Clubs),
    ten.of(Suit.Spades),
    ten.of(Suit.Spades),
    ten.of(Suit.Hearts),
    ten.of(Suit.Hearts),
    king.of(Suit.Hearts),
    queen.of(Suit.Spades),
    queen.of(Suit.Hearts),
  ];
  const hand = new Hand(cards);

  expect(hand.isPlayable()).toBe(false);
});

test("should detect hand with trumps equal or lesser than jack of diamonds", () => {
  const cards = [
    king.of(Suit.Hearts),
    king.of(Suit.Hearts),
    ten.of(Suit.Clubs),
    ten.of(Suit.Clubs),
    ten.of(Suit.Spades),
    ten.of(Suit.Spades),
    ten.of(Suit.Diamonds),
    ten.of(Suit.Diamonds),
    jack.of(Suit.Diamonds),
    jack.of(Suit.Diamonds),
  ];
  const hand = new Hand(cards);

  expect(hand.isPlayable()).toBe(false);
});

test("should detect suits that can be served", () => {
  const cards = [
    king.of(Suit.Hearts),
    king.of(Suit.Hearts),
    ten.of(Suit.Clubs),
    ten.of(Suit.Clubs),
    ten.of(Suit.Hearts),
    ten.of(Suit.Hearts),
    ten.of(Suit.Diamonds),
    ten.of(Suit.Diamonds),
    jack.of(Suit.Spades),
    jack.of(Suit.Spades),
  ];
  const hand = new Hand(cards);

  expect(hand.nonTrumps(Suit.Spades).length).toEqual(0);
  expect(hand.nonTrumps(Suit.Hearts).length).toEqual(2);
  expect(hand.nonTrumps(Suit.Clubs).length).toEqual(2);
});

test("should detect correct number of trumps in hand", () => {
  const cards = [
    king.of(Suit.Hearts),
    king.of(Suit.Hearts),
    ten.of(Suit.Clubs),
    ten.of(Suit.Clubs),
    ten.of(Suit.Spades),
    ten.of(Suit.Spades),
    ten.of(Suit.Diamonds),
    ten.of(Suit.Diamonds),
    jack.of(Suit.Diamonds),
    jack.of(Suit.Diamonds),
  ];
  const hand = new Hand(cards);

  expect(hand.trumps().length).toEqual(4);
});

test("should detect multiple single blank aces", () => {
  const cards = [
    ace.of(Suit.Hearts).first(),
    ace.of(Suit.Spades).first(),
    king.of(Suit.Clubs),
    ten.of(Suit.Clubs),
    ace.of(Suit.Clubs),
    ten.of(Suit.Hearts),
    ten.of(Suit.Hearts),
    queen.of(Suit.Diamonds),
    ace.of(Suit.Diamonds),
    jack.of(Suit.Spades),
  ];
  const hand = new Hand(cards);

  expect(hand.getBlankAces()).toEqual([
    ace.of(Suit.Spades).first(),
    ace.of(Suit.Hearts).first(),
  ]);
});

test("should detect low value cards in hand", () => {
  const cards = [
    ace.of(Suit.Hearts).first(),
    ace.of(Suit.Spades).first(),
    king.of(Suit.Clubs),
    ten.of(Suit.Clubs),
    ace.of(Suit.Clubs),
    ten.of(Suit.Hearts),
    ten.of(Suit.Hearts),
    queen.of(Suit.Diamonds),
    ace.of(Suit.Diamonds),
    jack.of(Suit.Spades),
  ];
  const hand = new Hand(cards);

  expect(hand.lowValues().length).toBe(3);
});

test("should detect low value cards in hand", () => {
  const cards = [
    ace.of(Suit.Hearts),
    king.of(Suit.Clubs),
    ten.of(Suit.Clubs),
    ace.of(Suit.Clubs),
    jack.of(Suit.Spades),
    jack.of(Suit.Clubs),
    queen.of(Suit.Spades),
    queen.of(Suit.Clubs),
    ten.of(Suit.Hearts),
    ten.of(Suit.Hearts),
  ];
  const hand = new Hand(cards);

  expect(hand.getMissingSuites()).toEqual([Suit.Spades]);
});

test("should detect highest card in hand", () => {
  const tenOfHearts = ten.of(Suit.Hearts).first();

  const cards = [
    ace.of(Suit.Hearts).first(),
    tenOfHearts,
    king.of(Suit.Clubs).first(),
    queen.of(Suit.Hearts).first(),
    jack.of(Suit.Clubs).first(),
  ];
  const hand = new Hand(cards);

  expect(hand.highest()).toEqual(tenOfHearts);
  expect(hand.trumps()[0]).toEqual(tenOfHearts);
});
