import Toggle from "@/components/Toggle.vue";
import { mount, config } from "@vue/test-utils";

config.global.mocks["$t"] = (msg: string) => msg;
config.global.mocks["$tc"] = (msg: string) => msg;
config.global.mocks["$i18n"] = { locale: "en" };

describe("Toggle.vue", () => {
  test("should render toggle", () => {
    const wrapper = mount(Toggle, {
      props: {
        disabled: false,
        label: "some label",
        modelValue: false,
      },
    });
    const toggle = wrapper.find(".toggle");
    expect(toggle.exists()).toBe(true);
    expect(toggle.classes()).not.toContain("disabled");
    expect(wrapper.find("label").text()).toEqual("some label");
  });

  test("should render toggle disabled state", () => {
    const wrapper = mount(Toggle, {
      props: {
        disabled: true,
        label: "some label",
        modelValue: false,
      },
    });
    const toggle = wrapper.find(".toggle");
    expect(toggle.classes()).toContain("disabled");
  });

  test("should emit value on click", async () => {
    const wrapper = mount(Toggle, {
      props: {
        disabled: false,
        label: "some label",
        modelValue: false,
      },
    });
    const toggleInput = wrapper.find(".toggle input");

    await toggleInput.setValue(true);

    expect(wrapper.emitted()).toHaveProperty("update:modelValue");
  });

  test("should not emit value if toggle is disabled", async () => {
    const wrapper = mount(Toggle, {
      props: {
        disabled: true,
        label: "some label",
        modelValue: false,
      },
    });
    const toggleInput = wrapper.find(".toggle input");

    await toggleInput.setValue(true);

    expect(wrapper.emitted()).not.toHaveProperty("update:modelValue");
  });
});
