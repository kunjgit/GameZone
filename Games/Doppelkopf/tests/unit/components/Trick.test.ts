import Trick from "@/components/Trick.vue";
import { Game } from "@/models/game";
import { Trick as TrickModel } from "@/models/trick";
import { ace, Suit } from "@/models/card";
import { mount, config } from "@vue/test-utils";

config.global.mocks["$t"] = () => {};
config.global.mocks["$tc"] = () => {};

let game: Game;
let trick: TrickModel;

beforeEach(() => {
  game = Game.singlePlayer();
  trick = game.currentTrick;
});

describe("Trick.vue", () => {
  test("should show empty trick on initialization", () => {
    const wrapper = mount(Trick, { props: { trick: trick } });
    expect(wrapper.findAll("div.card").length).toEqual(0);
  });

  test("should render cards in current trick", () => {
    trick.add(ace.of(Suit.Hearts), game.players[0]);

    const wrapper = mount(Trick, { props: { trick: trick } });

    expect(wrapper.findAll("div.card").length).toEqual(1);
  });
});
