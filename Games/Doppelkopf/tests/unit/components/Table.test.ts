import Table from "@/components/Table.vue";
import { Game } from "@/models/game";
import { Score } from "@/models/score";
import { Party, PartyName } from "@/models/party";
import { mount, config } from "@vue/test-utils";
import { Game as GameModel } from "@/models/game";

config.global.mocks["$t"] = (msg: string) => msg;
config.global.mocks["$tc"] = (msg: string) => msg;
config.global.mocks["$i18n"] = { locale: "en" };

let game: GameModel;

beforeEach(() => {
  game = Game.singlePlayer();
});

describe("Table.vue", () => {
  test("should render table components", () => {
    const wrapper = mount(Table, { props: { game: game } });
    expect(wrapper.findAll("div.player")).toHaveLength(4);
    expect(wrapper.find("div.trick").exists()).toBe(true);
    expect(wrapper.find("div.controls").exists()).toBe(true);
  });

  test("should hide Scorecard if game is not finished", () => {
    game.currentRound.isFinished = () => false;

    const wrapper = mount(Table, { props: { game: game } });

    expect(wrapper.find("div.scorecard").exists()).toBe(false);
  });

  test("should show Scorecard if game is finished", () => {
    game.players[0].points = () => 120;
    game.players[1].points = () => 120;
    const reParty = new Party(PartyName.Re, game.players[0], game.players[3]);
    const kontraParty = new Party(
      PartyName.Kontra,
      game.players[1],
      game.players[2]
    );
    const stubScore = new Score(reParty, kontraParty);
    stubScore.winner = () => reParty;
    game.currentRound.score = stubScore;
    game.currentRound.isFinished = () => true;

    const wrapper = mount(Table, { props: { game: game } });

    expect(wrapper.find("div.scorecard").exists()).toBe(true);
  });
});
