import AnnouncementsButton from "@/components/AnnouncementsButton.vue";
import { Announcement } from "@/models/announcements";
import { Game } from "@/models/game";
import { mount, config } from "@vue/test-utils";

config.global.mocks["$t"] = () => {};
config.global.mocks["$tc"] = () => {};

let game: Game;

beforeEach(() => {
  game = Game.singlePlayer();
});

describe("AnnouncementsButton.vue", () => {
  test("should hide announcements", () => {
    const wrapper = mount(AnnouncementsButton, {
      props: { player: game.players[0] },
    });

    expect(wrapper.find("button.toggle").exists()).toBe(true);
    expect(wrapper.find("div.dropdown").exists()).toBe(true);
    expect(wrapper.find("div.dropdown").isVisible()).toBe(false);
  });

  test("should show possible announcements if button is clicked", async () => {
    const wrapper = mount(AnnouncementsButton, {
      props: { player: game.players[0] },
    });

    await wrapper.find("button.toggle").trigger("click");

    expect(wrapper.find("div.dropdown").isVisible()).toBe(true);
  });

  test("should hide possible announcements after announcing", async () => {
    let player = game.players[0];
    const wrapper = mount(AnnouncementsButton, {
      props: { player: player },
    });

    await wrapper.find("button.toggle").trigger("click");
    await wrapper.find("div.dropdown button:first-child").trigger("click");

    expect(wrapper.find("div.dropdown").isVisible()).toBe(false);
  });

  test("should hide entire button if no announcements can be made", () => {
    let player = game.players[0];
    player.possibleAnnouncements = () => new Set<Announcement>();

    const wrapper = mount(AnnouncementsButton, {
      props: { player: player },
    });

    expect(wrapper.find(".announcements-button").isVisible()).toBe(false);
  });
});
