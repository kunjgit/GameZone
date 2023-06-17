import AffinityDebugger from "@/components/AffinityDebugger.vue";
import { Config } from "@/models/config";
import { Game } from "@/models/game";
import { mount, config } from "@vue/test-utils";

config.global.mocks["$t"] = (msg: string) => msg;
config.global.mocks["$tc"] = (msg: string) => msg;
config.global.mocks["$i18n"] = { locale: "en" };

const game = Game.singlePlayer();

describe("AffinityDebugger.vue", () => {
  test("should only be visible if config is enabled", () => {
    Config.showAffinityDebugger = true;
    const wrapper = mount(AffinityDebugger, {
      props: { affinities: game.players[0].behavior.affinities },
    });
    expect(wrapper.find(".affinity-debugger").exists()).toBe(true);
  });

  test("should only be visible if config is enabled", () => {
    Config.showAffinityDebugger = false;
    const wrapper = mount(AffinityDebugger, {
      props: { affinities: game.players[0].behavior.affinities },
    });
    expect(wrapper.find(".affinity-debugger").exists()).toBe(false);
  });
});
