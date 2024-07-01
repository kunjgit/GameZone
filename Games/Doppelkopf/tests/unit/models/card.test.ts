import { ace, ten, king, queen, jack, Suit } from "@/models/card";

test("ace has a value of 11", () => {
  const aceOfClubs = ace.of(Suit.Clubs);
  expect(aceOfClubs.value).toBe(11);
});

test("ten has a value of 10", () => {
  const tenOfDiamonds = ten.of(Suit.Diamonds);
  expect(tenOfDiamonds.value).toBe(10);
});

test("king has a value of 4", () => {
  const kingOfHearts = king.of(Suit.Hearts);
  expect(kingOfHearts.value).toBe(4);
});

test("queen has a value of 3", () => {
  const queenOfClubs = queen.of(Suit.Clubs);
  expect(queenOfClubs.value).toBe(3);
});

test("jack has a value of 2", () => {
  const jackOfClubs = jack.of(Suit.Clubs);
  expect(jackOfClubs.value).toBe(2);
});

test("jack has a value of 2", () => {
  const jackOfClubs = jack.of(Suit.Clubs);
  expect(jackOfClubs.value).toBe(2);
});

test("compare two cards", () => {
  expect(jack.of(Suit.Clubs).first()).toEqual(jack.of(Suit.Clubs).first());
});

test("compare identity two cards", () => {
  expect(jack.of(Suit.Clubs).first()).not.toBe(jack.of(Suit.Clubs).first());
});

test("compare two cards with same face", () => {
  expect(jack.of(Suit.Clubs).first()).not.toBe(jack.of(Suit.Clubs).second());
});

test("should get unique id of a card", () => {
  expect(jack.of(Suit.Clubs).first().cardId).toBe("J-♣-0");
});

test("finds all trumps", () => {
  const trumps = [
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

  trumps.forEach((card) => {
    expect(card.isTrump()).toBeTruthy();
  });
});

test("finds all non-trumps", () => {
  const nonTrumps = [
    ace.of(Suit.Clubs),
    ten.of(Suit.Clubs),
    king.of(Suit.Clubs),
    ace.of(Suit.Spades),
    ten.of(Suit.Spades),
    king.of(Suit.Spades),
    ace.of(Suit.Hearts),
    king.of(Suit.Hearts),
  ];

  nonTrumps.forEach((card) => {
    expect(card.isTrump()).toBeFalsy();
  });
});

test("queen of clubs beats queen of spades", () => {
  const higher = queen.of(Suit.Clubs);
  const lower = queen.of(Suit.Spades);
  expect(higher.compareTo(lower)).toBeLessThan(0);
});

test("jack of diamonds is beaten by jack of hearts", () => {
  const lower = jack.of(Suit.Diamonds);
  const higher = jack.of(Suit.Hearts);
  expect(lower.compareTo(higher)).toBeGreaterThan(0);
});

test("king of diamonds is beaten by jack of hearts", () => {
  const lower = king.of(Suit.Diamonds);
  const higher = jack.of(Suit.Hearts);
  expect(lower.compareTo(higher)).toBeGreaterThan(0);
});

test("first card of two equal cards beats second card", () => {
  const first = ace.of(Suit.Diamonds);
  const second = ace.of(Suit.Diamonds);
  expect(first.compareTo(second)).toEqual(0);
});

test("trump beats non-trump", () => {
  const trump = king.of(Suit.Diamonds);
  const nonTrump = king.of(Suit.Spades);
  expect(trump.compareTo(nonTrump)).toBeLessThan(0);
});

test("non-trump is beaten by trump", () => {
  const nonTrump = ten.of(Suit.Clubs);
  const trump = king.of(Suit.Diamonds);
  expect(nonTrump.compareTo(trump)).toBeGreaterThan(0);
});

test("non-trump does not beat other non-trump if they belong to different suits", () => {
  expect(ten.of(Suit.Clubs).compareTo(king.of(Suit.Spades))).toEqual(0);
});

test("ace of spades beats ten of spades", () => {
  const higherNonTrump = ace.of(Suit.Spades);
  const lowerNonTrump = ten.of(Suit.Spades);
  expect(higherNonTrump.compareTo(lowerNonTrump)).toBeLessThan(0);
});

test("king of spades is beaten by ten of spades", () => {
  const lowerNonTrump = king.of(Suit.Spades);
  const higherNonTrump = ten.of(Suit.Spades);
  expect(lowerNonTrump.compareTo(higherNonTrump)).toBeGreaterThan(0);
});

test("first non-trump beats other non-trump of same card", () => {
  const firstNonTrump = ace.of(Suit.Hearts);
  const secondNonTrump = ace.of(Suit.Hearts);
  expect(firstNonTrump.compareTo(secondNonTrump)).toEqual(0);
});

describe("trump explanation", () => {
  test("should explain why diamonds are trump", () => {
    expect(ace.of(Suit.Diamonds).whyTrump()).toEqual(
      "diamonds are always trump"
    );
  });

  test("should explain why jacks are trump", () => {
    expect(jack.of(Suit.Diamonds).whyTrump()).toEqual("jacks are always trump");
  });

  test("should explain why queens are trump", () => {
    expect(queen.of(Suit.Clubs).whyTrump()).toEqual("queens are always trump");
  });

  test("should explain why ten of hearts is trump", () => {
    expect(ten.of(Suit.Hearts).whyTrump()).toEqual(
      "the ten of hearts is always trump"
    );
  });

  test("should have no explanation for non-trump", () => {
    expect(ace.of(Suit.Spades).whyTrump()).toBe("");
  });

  test("shouldn't be same card", () => {
    let firstQueenOfClubs = queen.of(Suit.Clubs).first();
    let secondQueenOfClubs = queen.of(Suit.Clubs).second();
    expect(firstQueenOfClubs.equals(secondQueenOfClubs)).toEqual(false);
  });
});
