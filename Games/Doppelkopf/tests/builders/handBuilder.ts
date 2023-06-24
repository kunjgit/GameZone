import { sampleSize } from "@/models/random";
import { Card, cardOrder } from "@/models/card";
import { Hand } from "@/models/hand";

export function aHandWith(numberOfCards: number, ...cards: Card[]) {
  let cardsOnHand = cards;

  cardsOnHand.push(...sampleSize(cardOrder, numberOfCards - cards.length));

  return new Hand(cardsOnHand);
}

export function aHandWithout(numberOfCards: number, excludedCard: Card) {
  let cards = sampleSize(
    cardOrder.filter(
      (card) =>
        !(card.suit === excludedCard.suit && card.rank === excludedCard.rank)
    ),
    numberOfCards
  );
  return new Hand(cards);
}
