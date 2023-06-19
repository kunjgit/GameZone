import { Extra } from "./extras";
import { Player } from "./player";

export enum PartyName {
  Re = "Re",
  Kontra = "Kontra",
}

export function findParties(players: Player[]) {
  return {
    [PartyName.Re]: new Party(
      PartyName.Re,
      ...players.filter((player) => player.isRe())
    ),
    [PartyName.Kontra]: new Party(
      PartyName.Kontra,
      ...players.filter((player) => player.isKontra())
    ),
  };
}

export function getPartyName(player: Player): PartyName {
  return player.isRe() ? PartyName.Re : PartyName.Kontra;
}

export class Party {
  name: PartyName;
  players: Player[];

  constructor(name: PartyName, ...players: Player[]) {
    this.name = name;
    this.players = players;
  }

  isPlayingSolo() {
    return this.players.length === 1;
  }

  points() {
    return this.players.reduce((acc, player) => acc + player.points(), 0);
  }

  announcements() {
    return this.players.flatMap((p) => [...p.announcements]);
  }

  extras() {
    return this.players.reduce(
      (acc, player) => acc.concat(player.trickStack.extras()),
      new Array<Extra>()
    );
  }

  playerNames(): string {
    return this.players.map((player) => player.name).join(" & ");
  }
}
