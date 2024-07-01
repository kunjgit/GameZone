import { Deck } from "@/models/deck";
import { Card, Rank, Suit } from "@/models/card";

test("deck has 40 cards", () => {
  const deck = new Deck();
  expect(deck.cards).toHaveLength(40);
});

test("deck has two aces of diamonds", () => {
  const deck = new Deck();

  const firstAce = new Card(Rank.Ace, Suit.Diamonds, 0);
  const secondAce = new Card(Rank.Ace, Suit.Diamonds, 1);
  expect(deck.cards.filter((card) => card.equals(firstAce))).toHaveLength(1);
  expect(deck.cards.filter((card) => card.equals(secondAce))).toHaveLength(1);
});

test("deck is shuffled", () => {
  const oneDeck = new Deck();
  const anotherDeck = new Deck();

  expect(oneDeck.cards).not.toEqual(anotherDeck.cards);
});
