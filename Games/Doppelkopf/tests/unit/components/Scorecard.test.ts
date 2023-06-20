import Scorecard from "@/components/Scorecard.vue";
import { Scorecard as ScorecardModel } from "@/models/scorecard";
import { Player } from "@/models/player";
import { PartyName } from "@/models/party";
import { extras } from "@/models/extras";
import { ScoreBuilder } from "../../builders/scoreBuilder";
import { mount, config } from "@vue/test-utils";
import { Score } from "@/models/score";

config.global.mocks["$t"] = (key: string) => key;
config.global.mocks["$tc"] = (msg: string, count: number) => `${count} ${msg}`;

let players: Player[];
let score: Score;
let scorecard: ScorecardModel;

function stubScoreHumanPlayerWins() {
  players = [
    stubPlayer("Player 1", PartyName.Re, 60),
    stubPlayer("Player 2", PartyName.Re, 61),
    stubPlayer("Player 3", PartyName.Kontra, 59),
    stubPlayer("Player 4", PartyName.Kontra, 60),
  ];
  scorecard = new ScorecardModel(players);
  score = new ScoreBuilder()
    .withWinners(PartyName.Re, players[0], players[1])
    .withLosers(PartyName.Kontra, players[2], players[3])
    .withReExtras([extras.win, extras.announced_re, extras.fox])
    .withKontraExtras([])
    .withRePoints(3)
    .withKontraPoints(-3)
    .build();
}

function stubPlayer(name: string, party: string, points: number) {
  const stubbedPlayer = new Player(name);
  stubbedPlayer.isRe = () => party === PartyName.Re;
  stubbedPlayer.isKontra = () => party !== PartyName.Re;
  stubbedPlayer.points = () => points;
  return stubbedPlayer;
}

beforeEach(() => {
  players = [
    stubPlayer("Player 1", PartyName.Re, 60),
    stubPlayer("Player 2", PartyName.Re, 59),
    stubPlayer("Player 3", PartyName.Kontra, 60),
    stubPlayer("Player 4", PartyName.Kontra, 61),
  ];

  scorecard = new ScorecardModel(players);
  score = new ScoreBuilder()
    .withWinners(PartyName.Kontra, players[2], players[3])
    .withLosers(PartyName.Re, players[0], players[1])
    .withKontraExtras([extras.win, extras.announced_re])
    .withReExtras([extras.fox])
    .withRePoints(-2)
    .withKontraPoints(2)
    .build();
});

describe("Scorecard.vue", () => {
  it("should display scorecard", () => {
    const wrapper = mount(Scorecard, {
      props: {
        scorecard: scorecard,
        players: players,
        currentScore: score,
      },
    });

    expect(wrapper.find("table").exists()).toBe(true);
  });

  it("should display next round button", () => {
    const wrapper = mount(Scorecard, {
      props: {
        scorecard: scorecard,
        players: players,
        currentScore: score,
      },
    });

    expect(wrapper.find("button.next-round").exists()).toBe(true);
  });

  test("should emit next round event if next round button is clicked", () => {
    const wrapper = mount(Scorecard, {
      props: {
        scorecard: scorecard,
        players: players,
        currentScore: score,
      },
    });
    wrapper.find("button.next-round").trigger("click");

    expect(wrapper.emitted().nextRound).toHaveLength(1);
  });

  it("should show 'you win' message when player won", () => {
    stubScoreHumanPlayerWins();
    const wrapper = mount(Scorecard, {
      props: {
        scorecard: scorecard,
        players: players,
        currentScore: score,
      },
    });

    expect(wrapper.find("h1.message").text()).toContain("you_win");
  });

  it("should show 'you lose' message when player lost", () => {
    players = [
      stubPlayer("Player 1", PartyName.Re, 60),
      stubPlayer("Player 2", PartyName.Re, 59),
      stubPlayer("Player 3", PartyName.Kontra, 60),
      stubPlayer("Player 4", PartyName.Kontra, 61),
    ];

    scorecard = new ScorecardModel(players);
    score = new ScoreBuilder()
      .withWinners(PartyName.Kontra, players[2], players[3])
      .withLosers(PartyName.Re, players[0], players[1])
      .withReExtras([])
      .withKontraExtras([extras.win, extras.against_re])
      .withRePoints(-2)
      .withKontraPoints(2)
      .build();

    const wrapper = mount(Scorecard, {
      props: {
        scorecard: scorecard,
        players: players,
        currentScore: score,
      },
    });

    expect(wrapper.find("h1.message").text()).toContain("you_lose");
  });

  it("should make last scoreline bold", () => {
    scorecard.addScore(
      new ScoreBuilder()
        .withWinners(PartyName.Re, players[0], players[1])
        .withLosers(PartyName.Kontra, players[2], players[3])
        .withPoints(2)
        .build()
    );

    scorecard.addScore(
      new ScoreBuilder()
        .withWinners(PartyName.Re, players[1], players[3])
        .withLosers(PartyName.Kontra, players[2], players[0])
        .withPoints(4)
        .build()
    );

    const wrapper = mount(Scorecard, {
      props: {
        scorecard: scorecard,
        players: players,
        currentScore: score,
      },
    });

    const scorelines = wrapper.findAll(".scoreLine");
    expect(scorelines).toHaveLength(2);
    expect(scorelines[0].classes("bold")).toBe(false);
    expect(scorelines[1].classes("bold")).toBe(true);
  });

  it("should show points", () => {
    scorecard.addScore(
      new ScoreBuilder()
        .withWinners(PartyName.Re, players[0], players[1])
        .withLosers(PartyName.Kontra, players[2], players[3])
        .withPoints(2)
        .build()
    );

    scorecard.addScore(
      new ScoreBuilder()
        .withWinners(PartyName.Re, players[1], players[3])
        .withLosers(PartyName.Kontra, players[2], players[0])
        .withPoints(4)
        .build()
    );

    const wrapper = mount(Scorecard, {
      props: {
        scorecard: scorecard,
        players: players,
        currentScore: score,
      },
    });

    const scorelines = wrapper.findAll(".scoreLine");
    expect(scorelines).toHaveLength(2);
    expect(scorelines[0].text().replace(/\s*/g, "")).toEqual("22-2-22");
    expect(scorelines[1].text().replace(/\s*/g, "")).toEqual("-26-624");
  });

  it("should show extras list", () => {
    const wrapper = mount(Scorecard, {
      props: {
        scorecard: scorecard,
        players: players,
        currentScore: score,
      },
    });

    const kontraExtrasList = wrapper.findAll(".extras .kontra");
    expect(kontraExtrasList).toHaveLength(2);
    expect(kontraExtrasList[0].text()).toContain("win");
  });

  it("should show sum of scores for winning party", () => {
    const wrapper = mount(Scorecard, {
      props: {
        scorecard: scorecard,
        players: players,
        currentScore: score,
      },
    });

    const sumKontra = wrapper.find(".sum.kontra");
    expect(sumKontra.exists()).toBe(true);
    expect(sumKontra.text()).toContain("2");
    expect(wrapper.find(".sum.re").text()).toBe("");
  });
});
