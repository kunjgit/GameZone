import Card from "@/components/Card.vue";
import { ace, Suit } from "@/models/card";
import { mount, config } from "@vue/test-utils";

config.global.mocks["$t"] = (key: string) => key;
config.global.mocks["$tc"] = (key: string) => key;

describe("Card.vue", () => {
  it("should render correct contents", () => {
    const wrapper = mount(Card, {
      props: {
        card: ace.of(Suit.Hearts),
        isCovered: false,
      },
    });
    expect(wrapper.find(".card-top").text()).toBe("A♥");
    expect(wrapper.find(".card-center").text()).toBe("♥");
    expect(wrapper.find(".card-bottom").text()).toBe("A♥");
  });

  it("should render hearts suit red", () => {
    const wrapper = mount(Card, {
      props: {
        card: ace.of(Suit.Hearts),
        isCovered: false,
      },
    });
    expect(wrapper.find(".card-top").classes()).toContain("red");
    expect(wrapper.find(".card-top").classes()).not.toContain("black");
  });

  it("should render clubs suit black", () => {
    const wrapper = mount(Card, {
      props: {
        card: ace.of(Suit.Clubs),
        isCovered: false,
        side: false,
      },
    });
    expect(wrapper.find(".card-top").classes()).toContain("black");
    expect(wrapper.find(".card-top").classes()).not.toContain("red");
  });

  it("should render selected card", () => {
    const wrapper = mount(Card, {
      props: {
        card: ace.of(Suit.Spades),
        isSelected: true,
        isCovered: false,
      },
    });
    expect(wrapper.find(".card-inner").classes()).toContain("selected");
  });

  it("should apply position class", () => {
    const wrapper = mount(Card, {
      props: {
        card: ace.of(Suit.Spades),
        isSelected: true,
        position: "left",
      },
    });
    expect(wrapper.find(".card").classes()).toContain("left");
  });

  it("covered card should not show rank and suit", () => {
    const wrapper = mount(Card, {
      props: {
        card: ace.of(Suit.Spades),
        isSelected: false,
        isCovered: true,
      },
    });

    expect(wrapper.text()).not.toContain("A");
    expect(wrapper.text()).not.toContain("♥");
  });

  it("should render covered card", () => {
    const wrapper = mount(Card, {
      props: {
        card: ace.of(Suit.Spades),
        isCovered: true,
      },
    });

    expect(wrapper.find(".background").exists()).toBe(true);
  });
});
