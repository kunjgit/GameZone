import Notifications from "@/components/Notifications.vue";
import { notifier } from "@/models/notifier";
import { mount, config } from "@vue/test-utils";
import { nextTick } from "vue";

config.global.mocks["$t"] = (msg: string) => msg;
config.global.mocks["$tc"] = (msg: string) => msg;
jest.useFakeTimers();

describe("Notifications.vue", () => {
  afterEach(() => {
    jest.runAllTimers();
  });

  it("should display message", async () => {
    const wrapper = mount(Notifications);

    notifier.info("Hello World");
    await nextTick();

    expect(
      wrapper.find(".notification-container .flashMessages").exists()
    ).toBe(true);
    expect(wrapper.findAll(".msg")).toHaveLength(1);
    expect(wrapper.findAll(".msg")[0].text()).toBe("Hello World");
  });

  it("should display flash message", async () => {
    const wrapper = mount(Notifications);

    notifier.flash("Doppelkopf");
    await nextTick();

    expect(wrapper.findAll(".flashMessage")).toHaveLength(1);
    expect(wrapper.findAll(".flashMessage")[0].text()).toBe("Doppelkopf");
  });

  it("should display sticky messages", async () => {
    const wrapper = mount(Notifications);

    notifier.sticky("An update is available!", undefined, jest.fn());
    await nextTick();

    expect(wrapper.findAll(".msg.sticky")).toHaveLength(1);
    expect(wrapper.findAll(".msg.sticky")[0].text()).toBe(
      "An update is available!"
    );
  });

  it("should handle sticky messages click", async () => {
    notifier.stickies = [];
    const wrapper = mount(Notifications);
    const onClick = jest.fn();

    notifier.sticky("An update is available!", undefined, onClick);
    await nextTick();
    await wrapper.find(".msg.clickable").trigger("click");

    expect(onClick).toHaveBeenCalled();
  });

  it("should dismiss sticky message on dismiss click", async () => {
    notifier.stickies = [];
    const wrapper = mount(Notifications);
    const onDismiss = jest.fn();
    notifier.sticky("An update is available!", undefined, jest.fn(), onDismiss);
    await nextTick();

    const stickyCloseButton = wrapper.find(".msg.clickable .close-button");
    await stickyCloseButton.trigger("click");

    expect(onDismiss).toHaveBeenCalled();
  });
});
