import { TrickStack } from "@/models/trickStack";
import { Trick } from "@/models/trick";
import { Player } from "@/models/player";
import { ace, ten, king, queen, Suit } from "@/models/card";
import { extras } from "@/models/extras";

const player1 = new Player("player 1");
const player2 = new Player("player 2");
const player3 = new Player("player 3");
const player4 = new Player("player 4");
const players = [player1, player2, player3, player4];
players.forEach((p) => {
  p.behavior.affinities.setPlayers(players);
  p.behavior.affinities.declaresParty(player2);
});

let trickStack: TrickStack;

beforeEach(() => {
  trickStack = new TrickStack();
});

test("should add trick to trick stack", () => {
  const trick = new Trick(players);
  trick.add(ace.of(Suit.Hearts), player1);
  trick.add(ace.of(Suit.Hearts), player2);
  trick.add(ace.of(Suit.Spades), player3);
  trick.add(ace.of(Suit.Clubs), player4);

  trickStack.add(trick);

  expect(trickStack.tricks).toHaveLength(1);
  expect(trickStack.tricks[0]).toEqual(trick);
});

test("should list all cards in trick stack", () => {
  const someTrick = new Trick(players.slice(0, 2));
  const anotherTrick = new Trick(players.slice(0, 2));
  someTrick.add(ace.of(Suit.Hearts), player1);
  someTrick.add(ace.of(Suit.Hearts), player2);
  anotherTrick.add(ace.of(Suit.Spades), player1);
  anotherTrick.add(ace.of(Suit.Clubs), player2);

  trickStack.add(someTrick);
  trickStack.add(anotherTrick);

  expect(trickStack.cards()).toHaveLength(4);
});

test("should throw error if adding non-finished trick to stack", () => {
  function invalidMove() {
    let trick = new Trick(players);
    trick.add(ace.of(Suit.Hearts), players[0]);
    trickStack.add(trick);
  }

  expect(invalidMove).toThrowError(
    `can not add an unfinished trick to the trick stack`
  );
});

test("should calculate points of trick", () => {
  const someTrick = new Trick(players);
  someTrick.add(ace.of(Suit.Hearts), player1);
  someTrick.add(ten.of(Suit.Hearts), player2);
  someTrick.add(king.of(Suit.Hearts), player3);
  someTrick.add(ace.of(Suit.Hearts), player4);

  const anotherTrick = new Trick(players);
  anotherTrick.add(ace.of(Suit.Spades), player1);
  anotherTrick.add(queen.of(Suit.Clubs), player2);
  anotherTrick.add(king.of(Suit.Spades), player3);
  anotherTrick.add(ten.of(Suit.Clubs), player4);

  trickStack.add(someTrick);
  trickStack.add(anotherTrick);

  expect(trickStack.points()).toBe(64);
});

test("should evaluate trick stack", () => {
  const someTrick = new Trick(players);
  someTrick.add(ace.of(Suit.Hearts), player1);
  someTrick.add(ten.of(Suit.Hearts), player3);
  someTrick.add(king.of(Suit.Hearts), player2);
  someTrick.add(ace.of(Suit.Hearts), player4);
  trickStack.add(someTrick);

  expect(trickStack.points()).toBe(36);
  expect(trickStack.extras()).toEqual([]);
});

describe("extras", () => {
  test("should find Doppelkopf", () => {
    const someTrick = new Trick(players);
    someTrick.add(ace.of(Suit.Hearts), player1);
    someTrick.add(ten.of(Suit.Hearts), player3);
    someTrick.add(ten.of(Suit.Hearts), player2);
    someTrick.add(ace.of(Suit.Hearts), player4);
    trickStack.add(someTrick);

    expect(trickStack.points()).toBe(42);
    expect(trickStack.extras()).toEqual([extras.doppelkopf]);
  });

  test("should find Fox", () => {
    const someTrick = new Trick(players);
    player1.isRe = () => false;
    player3.isRe = () => true;

    someTrick.add(ace.of(Suit.Diamonds), player1);
    someTrick.add(ten.of(Suit.Hearts), player3);
    someTrick.add(king.of(Suit.Hearts), player2);
    someTrick.add(ace.of(Suit.Hearts), player4);
    trickStack.add(someTrick);

    expect(trickStack.extras()).toEqual([extras.fox]);
  });

  test("should find Doppelkopf and Fox", () => {
    const someTrick = new Trick(players);
    player1.isRe = () => false;
    player3.isRe = () => true;

    someTrick.add(ace.of(Suit.Diamonds), player1);
    someTrick.add(ten.of(Suit.Hearts), player3);
    someTrick.add(ten.of(Suit.Hearts), player2);
    someTrick.add(ace.of(Suit.Hearts), player4);
    trickStack.add(someTrick);

    expect(trickStack.extras()).toEqual([extras.doppelkopf, extras.fox]);
  });
});
