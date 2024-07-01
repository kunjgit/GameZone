import { ace, jack, king, queen, Suit, ten } from "@/models/card";
import { PlayedCard } from "@/models/playedCard";
import { Player } from "@/models/player";
import {
  PercentageMemory,
  PerfectMemory,
  PriorityMemory,
} from "@/models/memory";

describe("Testing memorize function", () => {
  test("perfect memory memorizes everything", () => {
    const memory = new PerfectMemory();
    const player = new Player("some-player");
    memory.memorize(new PlayedCard(jack.of(Suit.Diamonds), player));
    memory.memorize(new PlayedCard(jack.of(Suit.Diamonds), player));
    memory.memorize(new PlayedCard(jack.of(Suit.Hearts), player));
    memory.memorize(new PlayedCard(jack.of(Suit.Hearts), player));
    memory.memorize(new PlayedCard(jack.of(Suit.Spades), player));
    memory.memorize(new PlayedCard(jack.of(Suit.Spades), player));
    memory.memorize(new PlayedCard(jack.of(Suit.Clubs), player));
    memory.memorize(new PlayedCard(jack.of(Suit.Clubs), player));
    expect(memory.memorizedCards.length).toBe(8);
  });

  test("percentage memory memorizes a percentage of things", () => {
    const memory = new PercentageMemory(0.9);
    const player = new Player("some player");
    for (let index = 0; index < 10000; index++) {
      memory.memorize(new PlayedCard(jack.of(Suit.Diamonds), player));
    }
    expect(memory.memorizedCards.length).toBeGreaterThanOrEqual(8700);
    expect(memory.memorizedCards.length).toBeLessThanOrEqual(9300);
  });

  test("priority memory memorizes only specific cards", () => {
    const memory = new PriorityMemory();
    const player = new Player("some player");
    memory.memorize(new PlayedCard(king.of(Suit.Diamonds), player));
    memory.memorize(new PlayedCard(jack.of(Suit.Diamonds), player));
    memory.memorize(new PlayedCard(ten.of(Suit.Hearts), player));
    memory.memorize(new PlayedCard(queen.of(Suit.Spades), player));
    memory.memorize(new PlayedCard(ten.of(Suit.Hearts), player));
    memory.memorize(new PlayedCard(king.of(Suit.Spades), player));
    memory.memorize(new PlayedCard(ace.of(Suit.Diamonds), player));
    memory.memorize(new PlayedCard(ace.of(Suit.Clubs), player));
    expect(memory.memorizedCards.length).toBe(5);
  });
});

describe("Testing functionality", () => {
  test("Should detect that suit hasn't been played", () => {
    const memory = new PerfectMemory();
    expect(memory.hasSuitBeenPlayedBefore(Suit.Hearts)).toEqual(false);
    expect(memory.hasSuitBeenPlayedBefore(Suit.Spades)).toEqual(false);
    expect(memory.hasSuitBeenPlayedBefore(Suit.Clubs)).toEqual(false);
  });

  test("Should detect that suit has been played", () => {
    const memory = new PerfectMemory();
    memory.memorize(new PlayedCard(ace.of(Suit.Hearts), new Player("A")));
    memory.memorize(new PlayedCard(ace.of(Suit.Spades), new Player("B")));
    expect(memory.hasSuitBeenPlayedBefore(Suit.Hearts)).toEqual(true);
    expect(memory.hasSuitBeenPlayedBefore(Suit.Spades)).toEqual(true);
    expect(memory.hasSuitBeenPlayedBefore(Suit.Clubs)).toEqual(false);
  });

  test("Should detect that suit hasn't been played before", () => {
    const memory = new PerfectMemory();
    memory.memorize(new PlayedCard(ten.of(Suit.Hearts), new Player("A")));
    memory.memorize(new PlayedCard(queen.of(Suit.Spades), new Player("B")));
    expect(memory.hasSuitBeenPlayedBefore(Suit.Hearts)).toEqual(false);
    expect(memory.hasSuitBeenPlayedBefore(Suit.Spades)).toEqual(false);
    expect(memory.hasSuitBeenPlayedBefore(Suit.Clubs)).toEqual(false);
  });

  test("Should clear all memorizedCards from memory", () => {
    const memory = new PerfectMemory();
    memory.memorize(new PlayedCard(ace.of(Suit.Hearts), new Player("A")));
    memory.memorize(new PlayedCard(ace.of(Suit.Spades), new Player("B")));
    expect(memory.memorizedCards.length).toBe(2);
    memory.clearMemory();
    expect(memory.memorizedCards.length).toBe(0);
  });

  test("Should calculate points left in suit", () => {
    const memory = new PerfectMemory();
    memory.memorize(new PlayedCard(ace.of(Suit.Spades), new Player("A")));
    memory.memorize(new PlayedCard(ten.of(Suit.Spades), new Player("B")));
    memory.memorize(new PlayedCard(king.of(Suit.Spades), new Player("C")));
    memory.memorize(new PlayedCard(king.of(Suit.Spades), new Player("D")));
    expect(memory.pointsLeftInSuit(Suit.Spades)).toBe(21);
  });

  test("Should calculate points left in suit - hearts", () => {
    const memory = new PerfectMemory();
    memory.memorize(new PlayedCard(ace.of(Suit.Hearts), new Player("A")));
    memory.memorize(new PlayedCard(ace.of(Suit.Hearts), new Player("B")));
    memory.memorize(new PlayedCard(king.of(Suit.Hearts), new Player("C")));
    memory.memorize(new PlayedCard(king.of(Suit.Hearts), new Player("D")));
    expect(memory.pointsLeftInSuit(Suit.Hearts)).toBe(0);
  });

  test("Should calculate points left in suit, ignoring trumps", () => {
    const memory = new PerfectMemory();
    memory.memorize(new PlayedCard(ace.of(Suit.Spades), new Player("A")));
    memory.memorize(new PlayedCard(ten.of(Suit.Spades), new Player("B")));
    memory.memorize(new PlayedCard(king.of(Suit.Spades), new Player("C")));
    memory.memorize(new PlayedCard(king.of(Suit.Spades), new Player("D")));
    memory.memorize(new PlayedCard(jack.of(Suit.Spades), new Player("E")));
    memory.memorize(new PlayedCard(jack.of(Suit.Spades), new Player("F")));
    memory.memorize(new PlayedCard(queen.of(Suit.Spades), new Player("G")));
    expect(memory.pointsLeftInSuit(Suit.Spades)).toBe(21);
  });

  test("Should detect that suit has already been played in different trick", () => {
    const memory = new PerfectMemory();
    memory.memorize(
      new PlayedCard(ace.of(Suit.Spades), new Player("A")),
      "trick1"
    );
    expect(memory.hasSuitBeenPlayedBefore(Suit.Spades)).toEqual(true);
    expect(memory.hasSuitBeenPlayedBefore(Suit.Spades, "trick2")).toEqual(true);
  });

  test("Should detect that suit hasn't been played in different trick", () => {
    const memory = new PerfectMemory();
    memory.memorize(
      new PlayedCard(ace.of(Suit.Spades), new Player("A")),
      "trick1"
    );
    expect(memory.hasSuitBeenPlayedBefore(Suit.Spades)).toEqual(true);
    expect(memory.hasSuitBeenPlayedBefore(Suit.Spades, "trick1")).toEqual(
      false
    );
  });

  test("Should detect that queen of clubs is highest card left in game", () => {
    const memory = new PerfectMemory();
    memory.memorize(
      new PlayedCard(ten.of(Suit.Hearts).first(), new Player("A"))
    );
    memory.memorize(
      new PlayedCard(ten.of(Suit.Hearts).second(), new Player("B"))
    );
    memory.memorize(
      new PlayedCard(queen.of(Suit.Spades).first(), new Player("C"))
    );
    expect(memory.isHighestCardLeft(ten.of(Suit.Hearts))).toEqual(true);
    expect(memory.isHighestCardLeft(queen.of(Suit.Clubs))).toEqual(true);
    expect(memory.isHighestCardLeft(jack.of(Suit.Spades))).toEqual(false);
  });

  test("Should detect if non-trump suits have been started before", () => {
    const memory = new PerfectMemory();
    memory.memorizeTrick("1", ace.of(Suit.Clubs), new Player("A"));
    memory.memorizeTrick("2", queen.of(Suit.Spades), new Player("A"));
    expect(memory.hasSuitBeenStartedBefore(Suit.Clubs)).toEqual(true);
    expect(memory.hasSuitBeenStartedBefore(Suit.Spades)).toEqual(false);
    expect(memory.hasSuitBeenStartedBefore(Suit.Hearts)).toEqual(false);
  });

  test("Should detect if non-trump suits have been thrown", () => {
    const memory = new PerfectMemory();
    memory.memorizeTrick("1", ace.of(Suit.Spades), new Player("A"));
    memory.memorize(new PlayedCard(ace.of(Suit.Clubs), new Player("B")), "1");
    memory.memorize(new PlayedCard(jack.of(Suit.Hearts), new Player("C")), "1");
    expect(memory.hasSuitBeenThrown(Suit.Clubs)).toEqual(true);
    expect(memory.hasSuitBeenThrown(Suit.Spades)).toEqual(false);
    expect(memory.hasSuitBeenThrown(Suit.Hearts)).toEqual(false);
  });

  test("Should detect player that threw a suit", () => {
    const memory = new PerfectMemory();
    const bob = new Player("B");
    const chad = new Player("C");
    memory.memorizeTrick("1", ace.of(Suit.Spades), new Player("A"));
    memory.memorize(new PlayedCard(ace.of(Suit.Clubs), bob), "1");
    memory.memorize(new PlayedCard(ten.of(Suit.Spades), chad), "1");
    expect(memory.hasSuitBeenThrownByPlayer(Suit.Clubs, bob)).toEqual(true);
    expect(memory.hasSuitBeenThrownByPlayer(Suit.Spades, bob)).toEqual(false);
    expect(memory.hasSuitBeenThrownByPlayer(Suit.Hearts, bob)).toEqual(false);
    expect(memory.hasSuitBeenThrownByPlayer(Suit.Clubs, chad)).toEqual(false);
    expect(memory.hasSuitBeenThrownByPlayer(Suit.Spades, chad)).toEqual(false);
    expect(memory.hasSuitBeenThrownByPlayer(Suit.Hearts, chad)).toEqual(false);
  });

  test("Should remember and calculate points for player", () => {
    const memory = new PerfectMemory();
    const player1 = new Player("A");
    const player2 = new Player("B");
    memory.memorizeTrick("1", ace.of(Suit.Spades), player1);
    memory.memorize(new PlayedCard(ace.of(Suit.Spades), player1), "1");
    memory.memorize(new PlayedCard(ace.of(Suit.Clubs), player2), "1");
    expect(memory.pointsForPlayer(player1)).toEqual(22);
    expect(memory.pointsForPlayer(player2)).toEqual(0);
  });

  test("Should remember and calculate points for player within round", () => {
    const memory = new PerfectMemory();
    const player1 = new Player("A");
    const player2 = new Player("B");
    memory.memorizeTrick("1", ace.of(Suit.Spades), player1);
    memory.memorize(new PlayedCard(ace.of(Suit.Spades), player1), "1");
    memory.memorize(new PlayedCard(ten.of(Suit.Clubs), player2), "1");
    memory.memorizeTrick("2", ace.of(Suit.Clubs), player2);
    memory.memorize(new PlayedCard(ace.of(Suit.Spades), player1), "2");
    memory.memorize(new PlayedCard(ace.of(Suit.Clubs), player2), "2");
    memory.memorizeTrick("3", ace.of(Suit.Spades), player1);
    memory.memorize(new PlayedCard(ace.of(Suit.Hearts), player1), "3");
    memory.memorize(new PlayedCard(king.of(Suit.Hearts), player2), "3");
    expect(memory.pointsForPlayer(player1)).toEqual(36);
    expect(memory.pointsForPlayer(player2)).toEqual(22);
  });
});
