import Player from "@/components/Player.vue";
import { Game } from "@/models/game";
import { ace, ten, Suit } from "@/models/card";
import { mount, config } from "@vue/test-utils";

config.global.mocks["$t"] = (key: string) => key;
config.global.mocks["$tc"] = (msg: string) => msg;

const game = Game.singlePlayer();

describe("Player.vue", () => {
  test("should display player's name", () => {
    game.players[0].name = "some player";
    const wrapper = mount(Player, {
      props: { player: game.players[0] },
    });
    expect(wrapper.find(".name").text()).toEqual("some player");
  });

  test("should play card", () => {
    const cards = [ace.of(Suit.Spades)];
    game.players[0].hand.cards = cards;
    mount(Player, { props: { player: game.players[0] } });

    expect(game.players[0].hand.cards).toHaveLength(1);

    game.players[0].play(cards[0]);

    expect(game.players[0].hand.cards).toHaveLength(0);
  });

  test("should hide cards for computer player", () => {
    game.players[0].isHuman = false;
    game.players[0].hand.cards = [ace.of(Suit.Spades)];
    const wrapper = mount(Player, {
      props: { player: game.players[0] },
    });

    expect(wrapper.find(".hand .card-inner").classes()).toContain("covered");
  });

  test("should tell if hand is re", () => {
    game.players[0].isHuman = true;
    game.players[0].hand.isRe = () => true;

    const wrapper = mount(Player, {
      props: { player: game.players[0] },
    });

    expect(wrapper.find("div.party").text()).toEqual("Re");
  });

  test("should tell if hand is kontra", () => {
    game.players[0].isHuman = true;
    game.players[0].hand.isRe = () => false;

    const wrapper = mount(Player, {
      props: { player: game.players[0] },
    });

    expect(wrapper.find("div.party").text()).toEqual("Kontra");
  });

  test("should not show party for non-human player", () => {
    game.players[0].isHuman = false;
    game.players[0].hand.isRe = () => false;

    const wrapper = mount(Player, {
      props: { player: game.players[0] },
    });

    expect(wrapper.find("div.party").exists()).toBe(false);
  });

  test("should render winner", () => {
    let game = Game.singlePlayer();
    game.players[0].hand.cards = [ten.of(Suit.Hearts)];
    game.players[1].hand.cards = [ace.of(Suit.Diamonds)];
    game.players[2].hand.cards = [ace.of(Suit.Diamonds)];
    game.players[3].hand.cards = [ten.of(Suit.Diamonds)];

    game.players[0].play(game.players[0].hand.cards[0]);
    game.players[1].play(game.players[1].hand.cards[0]);
    game.players[2].play(game.players[2].hand.cards[0]);
    game.players[3].play(game.players[3].hand.cards[0]);
    const wrapper = mount(Player, {
      props: { player: game.players[0] },
    });

    expect(wrapper.find(".winner").exists()).toBe(true);
  });

  test("should not render winner if trick isn't finished", () => {
    let game = Game.singlePlayer();
    const cards = [
      ten.of(Suit.Hearts),
      ace.of(Suit.Diamonds),
      ace.of(Suit.Diamonds),
      ten.of(Suit.Diamonds),
    ];

    game.players[0].hand.cards = [cards[0]];
    game.players[1].hand.cards = [cards[1]];
    game.players[2].hand.cards = [cards[2]];
    game.players[3].hand.cards = [cards[3]];

    game.players[0].play(game.players[0].hand.cards[0]);
    game.players[1].play(game.players[1].hand.cards[0]);
    const wrapper = mount(Player, {
      props: { player: game.players[0] },
    });

    expect(wrapper.find(".winner").exists()).toBe(false);
  });
});
