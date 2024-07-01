import { Scorecard } from "@/models/scorecard";
import { Player } from "@/models/player";
import { PartyName } from "@/models/party";
import { ScoreBuilder } from "../../builders/scoreBuilder";

describe("Scorecard", () => {
  const players = [
    new Player("one"),
    new Player("two"),
    new Player("three"),
    new Player("four"),
  ];
  let scorecard: Scorecard;

  beforeEach(() => {
    scorecard = new Scorecard(players);
  });

  test("should play contain all players", () => {
    expect(scorecard.players).toHaveLength(4);
  });

  test("should initialize all players with 0 points", () => {
    expect(scorecard.totalPointsFor(players[0])).toBe(0);
    expect(scorecard.totalPointsFor(players[1])).toBe(0);
    expect(scorecard.totalPointsFor(players[2])).toBe(0);
    expect(scorecard.totalPointsFor(players[3])).toBe(0);
  });

  test("should calculate score line", () => {
    scorecard.addScore(
      new ScoreBuilder()
        .withWinners(PartyName.Re, players[0], players[3])
        .withLosers(PartyName.Kontra, players[1], players[2])
        .withPoints(4)
        .build()
    );

    expect(scorecard.scoreLines[0]).toBeDefined();
    expect(scorecard.scoreLines[0].points).toEqual(4);
    expect(scorecard.scoreLines[0].winners).toEqual([players[0], players[3]]);
    expect(scorecard.scoreLines[0].totalPoints[players[0].id]).toEqual(4);
    expect(scorecard.scoreLines[0].totalPoints[players[2].id]).toEqual(-4);
  });

  test("should calculate winning solo score line", () => {
    scorecard.addScore(
      new ScoreBuilder()
        .withWinners(PartyName.Re, players[0])
        .withLosers(PartyName.Kontra, players[1], players[2], players[3])
        .withRePoints(12)
        .withKontraPoints(-4)
        .build()
    );

    expect(scorecard.scoreLines[0]).toBeDefined();
    expect(scorecard.scoreLines[0].points).toEqual(12);
    expect(scorecard.scoreLines[0].winners).toEqual([players[0]]);
    expect(scorecard.scoreLines[0].totalPoints[players[1].id]).toEqual(-4);
    expect(scorecard.scoreLines[0].totalPoints[players[2].id]).toEqual(-4);
    expect(scorecard.scoreLines[0].totalPoints[players[3].id]).toEqual(-4);
    expect(scorecard.scoreLines[0].totalPoints[players[0].id]).toEqual(12);
  });

  test("should calculate loosing solo score line", () => {
    scorecard.addScore(
      new ScoreBuilder()
        .withWinners(PartyName.Re, players[1], players[2], players[3])
        .withLosers(PartyName.Kontra, players[0])
        .withRePoints(4)
        .withKontraPoints(-12)
        .build()
    );

    expect(scorecard.scoreLines[0]).toBeDefined();
    expect(scorecard.scoreLines[0].points).toEqual(4);
    expect(scorecard.scoreLines[0].winners).toEqual([
      players[1],
      players[2],
      players[3],
    ]);
    expect(scorecard.scoreLines[0].totalPoints[players[0].id]).toEqual(-12);
    expect(scorecard.scoreLines[0].totalPoints[players[1].id]).toEqual(4);
    expect(scorecard.scoreLines[0].totalPoints[players[2].id]).toEqual(4);
    expect(scorecard.scoreLines[0].totalPoints[players[3].id]).toEqual(4);
  });

  test("should calculate final scores", () => {
    scorecard.addScore(
      new ScoreBuilder()
        .withWinners(PartyName.Re, players[0], players[3])
        .withLosers(PartyName.Kontra, players[1], players[2])
        .withPoints(4)
        .build()
    );

    scorecard.addScore(
      new ScoreBuilder()
        .withWinners(PartyName.Re, players[1], players[3])
        .withLosers(PartyName.Kontra, players[0], players[2])
        .withPoints(2)
        .build()
    );

    expect(scorecard.totalPointsFor(players[0])).toBe(2);
    expect(scorecard.totalPointsFor(players[1])).toBe(-2);
    expect(scorecard.totalPointsFor(players[2])).toBe(-6);
    expect(scorecard.totalPointsFor(players[3])).toBe(6);
  });
});
