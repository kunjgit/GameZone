import LanguagePicker from "@/components/LanguagePicker.vue";
import { mount, config } from "@vue/test-utils";

config.global.mocks["$t"] = (msg: string) => msg;
config.global.mocks["$tc"] = (msg: string) => msg;
config.global.mocks["$i18n"] = { locale: "en" };

describe("LanguagePicker.vue", () => {
  test("should show select with two language options", () => {
    const wrapper = mount(LanguagePicker);
    expect(wrapper.find("#languages").text()).toContain("en");
    expect(wrapper.find("#languages").text()).toContain("de");
  });
});
