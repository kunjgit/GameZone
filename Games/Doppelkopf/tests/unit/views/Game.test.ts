import Game from "@/views/Game.vue";
import { Game as GameModel } from "@/models/game";
import { mount, config } from "@vue/test-utils";
import { Features } from "@/models/features";

config.global.mocks["$t"] = (msg: string) => msg;
config.global.mocks["$tc"] = (msg: string) => msg;
config.global.mocks["$i18n"] = { locale: "en" };

describe("Game.vue", () => {
  test("should render Table", () => {
    const wrapper = mount(Game, {
      props: { game: GameModel.singlePlayer() },
    });

    expect(wrapper.find(".table").exists()).toBe(true);
    expect(wrapper.find(".welcome").exists()).toBe(false);
  });

  test("should render Reservation dialog if enabled", () => {
    Features.enableReservations = true;

    const wrapper = mount(Game, {
      props: { game: GameModel.singlePlayer() },
    });

    expect(wrapper.find("#reservations-modal").exists()).toBe(true);
  });

  test("should not render Reservation dialog if disabled", () => {
    Features.enableReservations = false;

    const wrapper = mount(Game, {
      props: { game: GameModel.singlePlayer() },
    });

    expect(wrapper.find("#reservations-modal").exists()).toBe(false);
  });

  test("should hide modal after player selected a reservation", async () => {
    Features.enableReservations = true;
    const game = GameModel.singlePlayer();
    const wrapper = mount(Game, { props: { game: game } });

    await wrapper.find("#healthy-option").trigger("click");
    await wrapper.find("#reservation-button").trigger("click");

    expect(wrapper.find("#reservations-modal").exists()).toBe(false);
  });

  test("should show notification after player announced", () => {
    Features.enableReservations = true;

    const game = GameModel.singlePlayer();
  });
});
