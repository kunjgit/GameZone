import { Player } from "@/models/player";
import { RingQueue } from "./ringQueue";

export enum Reservation {
  None,
  Healthy, // player wants to play a regular game. "Gesund" in German Doppelkopf parlance.
  QueenSolo,
  JackSolo,
  AceSolo,
  ClubsSolo,
  SpadesSolo,
  HeartsSolo,
  DiamondsSolo,
  Wedding,
}

const nonSoloTypes = [Reservation.Healthy, Reservation.Wedding];

export class GameType {
  reservation: Reservation;
  player?: Player;

  constructor(reservation: Reservation, player?: Player) {
    this.reservation = reservation;
    this.player = player;
  }

  static normalGame() {
    return new GameType(Reservation.Healthy);
  }
}

export function findGameType(players: RingQueue<Player>): GameType | undefined {
  const gameTypeCandidates = players
    .asList()
    .map((p) => new GameType(p.reservation, p));

  const missingReservations = gameTypeCandidates.find(
    (c) => c.reservation === Reservation.None
  );
  if (missingReservations) {
    return undefined;
  }

  const solos = gameTypeCandidates.filter(
    (c) => !nonSoloTypes.includes(c.reservation)
  );

  if (solos.length > 0) {
    return solos[0];
  }

  const wedding = gameTypeCandidates.find(
    (c) => c.reservation === Reservation.Wedding
  );

  return wedding || GameType.normalGame();
}
