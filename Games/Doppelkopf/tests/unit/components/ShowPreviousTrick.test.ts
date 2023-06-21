import ShowPreviousTrick from "@/components/ShowPreviousTrick.vue";
import { mount, config } from "@vue/test-utils";
import { Trick } from "@/models/trick";
import { Player } from "@/models/player";
import { ace, Suit } from "@/models/card";

config.global.mocks["$t"] = (msg: string) => msg;
config.global.mocks["$tc"] = (msg: string) => msg;
config.global.mocks["$i18n"] = { locale: "en" };

const p1 = new Player("1");
const p2 = new Player("2");
const p3 = new Player("3");
const p4 = new Player("4");
const players = [p1, p2, p3, p4];
let trick: Trick;

describe("ShowPreviousTrick.vue", () => {
  beforeEach(() => {
    trick = new Trick(players);
    trick.add(ace.of(Suit.Clubs), p1);
  });

  test("should show previous trick icon", async () => {
    const wrapper = mount(ShowPreviousTrick, { props: { trick: trick } });

    expect(wrapper.find(".icon.icon-rewind").exists()).toBe(true);
  });

  test("should not show previous trick modal initially", async () => {
    const wrapper = mount(ShowPreviousTrick, { props: { trick: trick } });

    expect(wrapper.find(".modal").exists()).toBe(false);
  });

  test("should show previous trick modal on icon click", async () => {
    const wrapper = mount(ShowPreviousTrick, { props: { trick: trick } });

    await wrapper.find(".icon.icon-rewind").trigger("click");

    expect(wrapper.find(".modal").exists()).toBe(true);
  });
});
