import { Extra } from "./extras";
import { Trick } from "./trick";

export class TrickStack {
  tricks: Trick[];

  constructor(tricks: Trick[] = []) {
    this.tricks = tricks;
  }

  add(trick: Trick) {
    if (!trick.isFinished()) {
      throw new Error("can not add an unfinished trick to the trick stack");
    }

    this.tricks.push(trick);
  }

  cards() {
    const playedCards = this.tricks.flatMap((trick) => trick.playedCards);
    return playedCards.map((playedCard) => playedCard.card);
  }

  points() {
    return this.tricks.reduce((acc, trick) => acc + trick.points(), 0);
  }

  extras() {
    return this.tricks
      .reduce((acc, trick) => acc.concat(trick.extras()), new Array<Extra>())
      .flat();
  }
}
