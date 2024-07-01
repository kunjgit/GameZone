import TrickStack from "@/components/TrickStack.vue";
import { TrickStack as TrickStackModel } from "@/models/trickStack";
import { Trick } from "@/models/trick";
import { Player } from "@/models/player";
import { ace, queen, Suit } from "@/models/card";
import { mount, config } from "@vue/test-utils";

config.global.mocks["$t"] = () => {};
config.global.mocks["$tc"] = () => {};

const player1 = new Player("player 1");
const player2 = new Player("player 2");
const trick = new Trick([player1, player2]);
trick.add(ace.of(Suit.Hearts), player1);
trick.add(queen.of(Suit.Spades), player2);

describe("TrickStack.vue", () => {
  test("should show placeholder if player has no trick", () => {
    const emptyTrickStack = new TrickStackModel();
    const wrapper = mount(TrickStack, {
      props: { trickStack: emptyTrickStack },
    });
    expect(wrapper.find(".placeholder").exists()).toBe(true);
  });

  test("should not show placeholder if player has a trick", () => {
    const trickStack = new TrickStackModel();
    trickStack.add(trick);
    const wrapper = mount(TrickStack, {
      props: { trickStack: trickStack },
    });
    expect(trick.playedCards).toHaveLength(2);
    expect(wrapper.find("div.trickStack").exists()).toBe(true);
    expect(wrapper.findAll("div.card")).toHaveLength(1);
    expect(wrapper.find(".placeholder").exists()).toBe(false);
  });

  test("should display number of won tricks", () => {
    const trickStack = new TrickStackModel();
    trickStack.add(trick);
    trickStack.add(trick);
    const wrapper = mount(TrickStack, {
      props: { trickStack: trickStack },
    });
    expect(wrapper.find(".trickCount").exists()).toBe(true);
  });
});
