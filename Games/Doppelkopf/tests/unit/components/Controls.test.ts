import Controls from "@/components/Controls.vue";
import { Game } from "@/models/game";
import { ace, Suit } from "@/models/card";
import { mount, config } from "@vue/test-utils";
import { Trick } from "@/models/trick";

config.global.mocks["$t"] = () => {};
config.global.mocks["$tc"] = () => {};

let game: Game;
let trick: Trick;

beforeEach(() => {
  game = Game.singlePlayer();
  trick = game.currentTrick;
});

describe("Controls.vue", () => {
  test("should render next trick button if trick is finished", () => {
    trick.add(ace.of(Suit.Hearts), game.players[0]);
    trick.add(ace.of(Suit.Hearts), game.players[1]);
    trick.add(ace.of(Suit.Hearts), game.players[2]);
    trick.add(ace.of(Suit.Hearts), game.players[3]);

    game.currentRound.noMoreCardsLeft = () => false;

    const wrapper = mount(Controls, { props: { game: game } });

    expect(wrapper.find("button.next").exists()).toBe(true);
  });

  test("should not render next trick button if round can be finished", () => {
    game.currentRound.noMoreCardsLeft = () => false;

    const wrapper = mount(Controls, { props: { game: game } });

    expect(wrapper.find("button.next").exists()).toBe(false);
  });

  test("should not render next button if trick is empty", () => {
    const wrapper = mount(Controls, { props: { game: game } });

    expect(wrapper.find("button.next").exists()).toBe(false);
  });

  test("should emit next trick event if next button is clicked", () => {
    trick.add(ace.of(Suit.Hearts), game.players[0]);
    trick.add(ace.of(Suit.Hearts), game.players[1]);
    trick.add(ace.of(Suit.Hearts), game.players[2]);
    trick.add(ace.of(Suit.Hearts), game.players[3]);
    const wrapper = mount(Controls, { props: { game: game } });

    wrapper.find("button.next").trigger("click");

    expect(wrapper.emitted().nextTrick?.length).toBe(1);
  });

  test("should not render finish button if there are still cards left on hands", () => {
    game.currentRound.noMoreCardsLeft = () => false;

    const wrapper = mount(Controls, { props: { game: game } });

    expect(wrapper.find("button.finish").exists()).toBe(false);
  });

  test("should render finish button if no more cards are left", () => {
    game.currentRound.noMoreCardsLeft = () => true;

    const wrapper = mount(Controls, { props: { game: game } });

    expect(wrapper.find("button.finish").exists()).toBe(true);
  });

  test("should not render finish button after round has been finished", () => {
    game.currentRound.noMoreCardsLeft = () => true;
    game.currentRound.isFinished = () => true;

    const wrapper = mount(Controls, { props: { game: game } });

    expect(wrapper.find("button.finish").exists()).toBe(false);
  });

  test("should emit finish event if finish button is clicked", () => {
    game.currentRound.noMoreCardsLeft = () => true;
    const wrapper = mount(Controls, { props: { game: game } });

    wrapper.find("button.finish").trigger("click");

    expect(wrapper.emitted().finishRound?.length).toBe(1);
  });
});
