import { Card } from "@/models/card";

export function playableCards(cards: Array<Card>, baseCard?: Card) {
  if (!baseCard) {
    return cards;
  }

  if (!baseCard.isTrump()) {
    const matchingNonTrumps = cards
      .filter((card) => card.suit === baseCard.suit)
      .filter((card) => !card.isTrump());
    return matchingNonTrumps.length > 0 ? matchingNonTrumps : cards;
  }

  const trumps = cards.filter((card) => card.isTrump());
  return trumps.length > 0 ? trumps : cards;
}
