import { Reservation, GameType, findGameType } from "@/models/reservations";
import { RingQueue } from "@/models/ringQueue";
import { PlayerBuilder } from "../../builders/playerBuilder";

const player1 = new PlayerBuilder("one").build();
const player2 = new PlayerBuilder("two").build();
const player3 = new PlayerBuilder("three").build();
const player4 = new PlayerBuilder("four").build();

const players = new RingQueue([player1, player2, player3, player4]);

beforeEach(() => {
  // reset reservations and anything else, to make sure they don't stick around between tests
  players.asList().forEach((p) => p.reset());
});

describe("findGameType()", () => {
  test("should return undefined if reservations are still missing", () => {
    const gameType = findGameType(players);

    expect(gameType).toBeUndefined();
  });

  test("should detect a normal game if each player is healthy", () => {
    player1.declareReservation(Reservation.Healthy);
    player2.declareReservation(Reservation.Healthy);
    player3.declareReservation(Reservation.Healthy);
    player4.declareReservation(Reservation.Healthy);

    const gameType = findGameType(players);

    expect(gameType).toEqual(GameType.normalGame());
  });

  test("should detect a solo game if a player declares a solo", () => {
    player1.declareReservation(Reservation.Healthy);
    player2.declareReservation(Reservation.Healthy);
    player3.declareReservation(Reservation.Healthy);
    player4.declareReservation(Reservation.AceSolo);

    const gameType = findGameType(players);

    expect(gameType?.reservation).toEqual(Reservation.AceSolo);
    expect(gameType?.player).toEqual(player4);
  });

  test("should prioritize by player order if multiple players declare a solo", () => {
    player1.declareReservation(Reservation.Healthy);
    player2.declareReservation(Reservation.Healthy);
    player4.declareReservation(Reservation.AceSolo);
    player3.declareReservation(Reservation.QueenSolo);

    const gameType = findGameType(players);

    expect(gameType?.reservation).toEqual(Reservation.QueenSolo);
    expect(gameType?.player).toEqual(player3);
  });

  test("should detect wedding", () => {
    player1.declareReservation(Reservation.Healthy);
    player2.declareReservation(Reservation.Wedding);
    player3.declareReservation(Reservation.Healthy);
    player4.declareReservation(Reservation.Healthy);

    const gameType = findGameType(players);

    expect(gameType?.reservation).toEqual(Reservation.Wedding);
    expect(gameType?.player).toEqual(player2);
  });

  test("should prioritize solo over wedding", () => {
    player1.declareReservation(Reservation.Healthy);
    player2.declareReservation(Reservation.Wedding);
    player3.declareReservation(Reservation.Healthy);
    player4.declareReservation(Reservation.JackSolo);

    const gameType = findGameType(players);

    expect(gameType?.reservation).toEqual(Reservation.JackSolo);
    expect(gameType?.player).toEqual(player4);
  });
});
