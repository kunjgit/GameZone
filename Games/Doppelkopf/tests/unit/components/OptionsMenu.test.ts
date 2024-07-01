import OptionsMenu from "@/components/OptionsMenu.vue";
import { mount, config } from "@vue/test-utils";

config.global.mocks["$t"] = (msg: string) => msg;
config.global.mocks["$tc"] = (msg: string) => msg;
config.global.mocks["$i18n"] = { locale: "en" };

describe("OptionsMenu.vue", () => {
  test("should show options icon", () => {
    const wrapper = mount(OptionsMenu);

    expect(wrapper.find(".icon.icon-options").exists()).toBe(true);
  });

  test("should not show options modal initially", () => {
    const wrapper = mount(OptionsMenu);

    expect(wrapper.find(".modal").exists()).toBe(false);
  });

  test("should show options modal on icon click", async () => {
    const wrapper = mount(OptionsMenu);

    await wrapper.find(".icon.icon-options").trigger("click");

    expect(wrapper.find(".modal").exists()).toBe(true);
  });

  test("should show affinity debugger option in debug mode", async () => {
    const wrapper = mount(OptionsMenu);

    await wrapper.find(".icon.icon-options").trigger("click");

    expect(wrapper.find(".modal .affinity-debugger").exists()).toBe(true);
  });
});
