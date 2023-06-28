import { Score } from "@/models/score";
import { Party, PartyName } from "@/models/party";
import { Extra } from "@/models/extras";
import { Player } from "@/models/player";

export class ScoreBuilder {
  extras: { [party in PartyName]: Extra[] };
  points: { [party in PartyName]: number };
  winningParty?: Party;
  losingParty?: Party;

  constructor() {
    this.extras = { [PartyName.Re]: [], [PartyName.Kontra]: [] };
    this.points = { [PartyName.Re]: 0, [PartyName.Kontra]: 0 };
  }

  withWinners(partyName: PartyName, ...players: Player[]) {
    this.winningParty = new Party(partyName, ...players);
    return this;
  }

  withLosers(partyName: PartyName, ...players: Player[]) {
    this.losingParty = new Party(partyName, ...players);
    return this;
  }

  withPoints(points: number) {
    this.points[PartyName.Re] = points;
    this.points[PartyName.Kontra] = -points;
    return this;
  }

  withRePoints(points: number) {
    this.points[PartyName.Re] = points;
    return this;
  }

  withKontraPoints(points: number) {
    this.points[PartyName.Kontra] = points;
    return this;
  }

  withReExtras(extras: Extra[]) {
    this.extras[PartyName.Re] = extras;
    return this;
  }

  withKontraExtras(extras: Extra[]) {
    this.extras[PartyName.Kontra] = extras;
    return this;
  }

  build() {
    if (this.winningParty) {
      this.winningParty.points = () => 130;
    }

    if (this.losingParty) {
      this.losingParty.points = () => 110;
    }

    const score = new Score(this.winningParty!, this.losingParty!);
    score.winningPartyName = () => this.winningParty!.name;
    score.winner = () => this.winningParty;
    score.totalPoints = (partyName) => this.points[partyName];
    score.listExtras = (partyName) => this.extras[partyName];
    return score;
  }
}
