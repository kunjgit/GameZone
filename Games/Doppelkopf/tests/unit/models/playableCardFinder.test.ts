import { playableCards } from "@/models/playableCardFinder";
import { ace, queen, Suit, ten } from "@/models/card";

describe("Playable Card Finder", () => {
  test("should highlight matching non-trumps only when player needs to serve", () => {
    const baseCard = ace.of(Suit.Spades);
    const matchingNonTrump = ten.of(Suit.Spades);
    const cards = [
      queen.of(Suit.Spades),
      ten.of(Suit.Diamonds),
      queen.of(Suit.Diamonds),
      matchingNonTrump,
    ];

    const foundCards = playableCards(cards, baseCard);

    expect(foundCards).toEqual([matchingNonTrump]);
  });

  test("should highlight trumps only when player needs to serve trump", () => {
    const baseCard = ace.of(Suit.Diamonds);
    const trumps = [
      ten.of(Suit.Hearts),
      queen.of(Suit.Clubs),
      ten.of(Suit.Diamonds),
    ];
    const cards = [...trumps, ace.of(Suit.Clubs), ten.of(Suit.Spades)];

    const foundCards = playableCards(cards, baseCard);

    expect(foundCards).toEqual(expect.arrayContaining(trumps));
  });

  test("should highlight all cards when no base card is defined", () => {
    const baseCard = undefined;
    const cards = [
      ace.of(Suit.Clubs),
      ten.of(Suit.Spades),
      queen.of(Suit.Diamonds),
    ];

    const foundCards = playableCards(cards, baseCard);

    expect(foundCards).toEqual(cards);
  });

  test("should highlight all cards when player cannot serve non-trump", () => {
    const baseCard = ten.of(Suit.Spades);
    const cards = [
      queen.of(Suit.Diamonds),
      ace.of(Suit.Diamonds),
      ace.of(Suit.Clubs),
    ];

    const foundCards = playableCards(cards, baseCard);

    expect(foundCards).toEqual(cards);
  });

  test("should highlight all cards when player cannot serve trump", () => {
    const baseCard = ten.of(Suit.Hearts);
    const cards = [ace.of(Suit.Spades), ace.of(Suit.Clubs)];

    const foundCards = playableCards(cards, baseCard);

    expect(foundCards).toEqual(cards);
  });
});
