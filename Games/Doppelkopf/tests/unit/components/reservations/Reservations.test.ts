import Reservations from "@/components/reservations/Reservations.vue";
import { Game as GameModel } from "@/models/game";
import { Reservation } from "@/models/reservations";
import { mount, config } from "@vue/test-utils";

config.global.mocks["$t"] = (msg: string) => msg;
config.global.mocks["$tc"] = (msg: string) => msg;
config.global.mocks["$i18n"] = { locale: "en" };

const player = GameModel.singlePlayer().players[0];

describe("Reservations.vue", () => {
  test("should render Hand", () => {
    const wrapper = mount(Reservations, {
      props: { player: player },
    });

    expect(wrapper.find(".hand").exists()).toBe(true);
  });

  test("should render 'healthy' button text if player selects normal game", async () => {
    const wrapper = mount(Reservations, {
      props: { player: player },
    });

    await wrapper.find("#ace-solo-option").trigger("click");
    await wrapper.find("#healthy-option").trigger("click");

    expect(wrapper.find("button").text()).toEqual("Normales Spiel spielen");
  });

  test("should render 'solo' button text if player selects a solo game", async () => {
    const wrapper = mount(Reservations, {
      props: { player: player },
    });

    await wrapper.find("#ace-solo-option").trigger("click");

    expect(wrapper.find("button").text()).toEqual("Vorbehalt anmelden");
  });

  test("should emit event with reservation on button click", async () => {
    const wrapper = mount(Reservations, {
      props: { player: player },
    });

    await wrapper.find("#jack-solo-option").trigger("click");
    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted()).toHaveProperty("reservation-selected");
    expect(wrapper.emitted()["reservation-selected"][0]).toEqual([
      Reservation.JackSolo,
    ]);
  });
});
