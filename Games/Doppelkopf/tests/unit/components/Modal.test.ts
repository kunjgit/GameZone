import Modal from "@/components/Modal.vue";
import { mount, config } from "@vue/test-utils";

config.global.mocks["$t"] = (msg: string) => msg;
config.global.mocks["$tc"] = (msg: string) => msg;
config.global.mocks["$i18n"] = { locale: "en" };

describe("Modal.vue", () => {
  test("should not show modal", () => {
    const wrapper = mount(Modal, { props: { visible: false } });

    expect(wrapper.find(".modal").exists()).toBe(false);
    expect(wrapper.find(".modal-content").exists()).toBe(false);
  });

  test("should show modal", () => {
    const wrapper = mount(Modal, { props: { visible: true } });

    expect(wrapper.find(".modal").exists()).toBe(true);
    expect(wrapper.find(".modal-content").exists()).toBe(true);
  });

  test("should emit clickaway event", async () => {
    const wrapper = mount(Modal, { props: { visible: true } });

    await wrapper.find(".modal").trigger("click");

    expect(wrapper.emitted().clickaway?.length).toBe(1);
  });
});
