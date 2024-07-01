import {
  RuleBasedBehaviour,
  HighestCardBehavior,
  RandomCardBehavior,
} from "@/models/behaviors";
import { Hand } from "@/models/hand";
import { Announcement } from "@/models/announcements";
import { ace, king, queen, jack, Suit, ten, Card } from "@/models/card";
import { Trick } from "@/models/trick";
import { Player } from "@/models/player";
import { PerfectMemory } from "@/models/memory";
import { PlayedCard } from "@/models/playedCard";
import { Affinities } from "@/models/affinities";

jest.mock("@/models/random", () => ({
  __esModule: true,
  chance: () => true,
  sample: (arr: Array<any>) => arr[0],
}));

describe("Highest Card Behavior", () => {
  const player = new Player("some player");
  const behavior = new HighestCardBehavior(player.id, new Affinities(player));
  const hand = new Hand([
    ace.of(Suit.Hearts).first(),
    jack.of(Suit.Clubs).first(),
    queen.of(Suit.Spades).second(),
    king.of(Suit.Hearts).first(),
  ]);
  const trick = new Trick([player]);
  trick.add(ten.of(Suit.Diamonds), player);

  test("should play highest possible card", () => {
    const cardToPlay = behavior.cardToPlay(hand, trick);
    expect(cardToPlay).toEqual(queen.of(Suit.Spades).second());
  });
});

describe("Random Card Behavior", () => {
  const player = new Player("some player");
  const behavior = new RandomCardBehavior(player.id, new Affinities(player));
  const hand = new Hand([
    ace.of(Suit.Hearts).first(),
    jack.of(Suit.Clubs).first(),
    queen.of(Suit.Spades).second(),
    king.of(Suit.Hearts).first(),
  ]);
  const trick = new Trick([player]);
  trick.add(ten.of(Suit.Diamonds), player);

  test("should play a random card", () => {
    const cardToPlay = behavior.cardToPlay(hand, trick);
    expect(cardToPlay).toEqual(expect.any(Card));
  });

  test("should make an announcement by chance", () => {
    const possibleAnnouncements = new Set([Announcement.Re, Announcement.No90]);

    const announcement = behavior.announcementToMake(possibleAnnouncements);

    expect(announcement).toEqual(Announcement.Re);
  });

  test("should return null if no announcement possible", () => {
    const announcement = behavior.announcementToMake(new Set());

    expect(announcement).toBe(null);
  });
});

describe("Rule Based Card Behavior", () => {
  const no_memory = new PerfectMemory();
  const player1 = new Player("p1");
  const player2 = new Player("p2");
  const player3 = new Player("p3");
  const player4 = new Player("p4");
  const players = [player1, player2, player3, player4];
  const behavior = new RuleBasedBehaviour(player1.id, new Affinities(player1));
  const hand = new Hand([
    ten.of(Suit.Hearts).first(),
    jack.of(Suit.Diamonds).first(),
    ace.of(Suit.Diamonds).first(),
    king.of(Suit.Diamonds).first(),
    ace.of(Suit.Clubs).first(),
    ten.of(Suit.Clubs).first(),
    king.of(Suit.Clubs).first(),
    ace.of(Suit.Spades).first(),
    ace.of(Suit.Spades).second(),
    ten.of(Suit.Spades).first(),
    king.of(Suit.Spades).first(),
  ]);

  describe("Announcements", () => {
    test("shouldn't announce because not possible", () => {
      const announcement = behavior.announcementToMake(new Set([]), hand);
      expect(announcement).toBeNull();
    });

    test("shouldn't announce although possible", () => {
      const announcement = behavior.announcementToMake(
        new Set([Announcement.Re, Announcement.No90]),
        hand
      );

      expect(announcement).toBeNull();
    });

    test("should announce >= 9 trumps", () => {
      const hand = new Hand([
        king.of(Suit.Hearts).first(),
        ace.of(Suit.Hearts).first(),
        king.of(Suit.Diamonds).second(),
        ace.of(Suit.Diamonds).first(),
        jack.of(Suit.Diamonds).first(),
        jack.of(Suit.Clubs).first(),
        jack.of(Suit.Spades).first(),
        queen.of(Suit.Hearts).first(),
        queen.of(Suit.Clubs).first(),
        ten.of(Suit.Hearts).first(),
      ]);

      const announcement = behavior.announcementToMake(
        new Set([Announcement.Re, Announcement.No90]),
        hand
      );

      expect(announcement).toEqual(Announcement.Re);
    });

    test("should announce ten of hearts and three queens", () => {
      const hand = new Hand([
        king.of(Suit.Spades).first(),
        king.of(Suit.Clubs).first(),
        king.of(Suit.Diamonds).second(),
        ace.of(Suit.Diamonds).first(),
        jack.of(Suit.Diamonds).first(),
        jack.of(Suit.Clubs).first(),
        queen.of(Suit.Spades).first(),
        queen.of(Suit.Hearts).first(),
        queen.of(Suit.Clubs).first(),
        ten.of(Suit.Hearts).first(),
      ]);

      const announcement = behavior.announcementToMake(
        new Set([Announcement.Re, Announcement.No90]),
        hand
      );

      expect(announcement).toEqual(Announcement.Re);
    });
  });

  describe("Starting rules", () => {
    beforeEach(() => {
      players.forEach((p) => p.memory.clearMemory());
    });

    test("should start with ace", () => {
      let hand = new Hand([
        ace.of(Suit.Spades).first(),
        ace.of(Suit.Clubs),
        ten.of(Suit.Clubs),
        ace.of(Suit.Hearts),
        ace.of(Suit.Diamonds),
      ]);
      const trick = new Trick(players);
      const cardToPlay = behavior.cardToPlay(hand, trick, no_memory);
      expect(cardToPlay).toEqual(ace.of(Suit.Spades).first());
    });

    test("kontra should start with least valueable card", () => {
      let hand = new Hand([
        king.of(Suit.Clubs).first(),
        ten.of(Suit.Clubs),
        ten.of(Suit.Spades),
        ace.of(Suit.Diamonds),
        jack.of(Suit.Spades).first(),
        jack.of(Suit.Clubs).first(),
      ]);
      const trick = new Trick(players);
      const cardToPlay = behavior.cardToPlay(hand, trick, no_memory);
      expect(cardToPlay).toEqual(king.of(Suit.Clubs).first());
    });

    test("re should start with trump", () => {
      let hand = new Hand([
        king.of(Suit.Clubs).first(),
        ten.of(Suit.Clubs),
        ten.of(Suit.Spades),
        ace.of(Suit.Diamonds),
        jack.of(Suit.Spades).first(),
        jack.of(Suit.Clubs).first(),
      ]);
      const trick = new Trick(players);
      player1.isRe = () => true;
      const cardToPlay = player1.behavior.cardToPlay(hand, trick, no_memory);
      expect(cardToPlay).toEqual(jack.of(Suit.Spades).first());
    });
  });

  describe("Non-trump has been played for the first time", () => {
    beforeEach(() => {
      players.forEach((p) => p.memory.clearMemory());
    });

    test("should play lowest value nonTrump when not starting", () => {
      const trick = new Trick(players);
      trick.add(ace.of(Suit.Clubs).second(), player1);
      trick.add(ten.of(Suit.Clubs).second(), player2);
      trick.add(king.of(Suit.Clubs).second(), player3);
      const cardToPlay = behavior.cardToPlay(hand, trick, no_memory);
      expect(cardToPlay).toEqual(king.of(Suit.Clubs).first());
    });

    test("should play ace of suit, when first time served and lower card was played", () => {
      const trick = new Trick(players);
      trick.add(ten.of(Suit.Clubs).second(), player1);
      const cardToPlay = behavior.cardToPlay(hand, trick, no_memory);
      expect(cardToPlay).toEqual(ace.of(Suit.Clubs).first());
    });

    test("should play lowest of suit, when first time served and not able to go higher", () => {
      let hand = new Hand([king.of(Suit.Clubs).first(), ten.of(Suit.Clubs)]);
      const trick = new Trick(players);
      trick.add(ten.of(Suit.Clubs).second(), player1);
      const cardToPlay = behavior.cardToPlay(hand, trick, no_memory);
      expect(cardToPlay).toEqual(king.of(Suit.Clubs).first());
    });

    test("should play ace, when mustn't serve", () => {
      const trick = new Trick(players);
      trick.add(ace.of(Suit.Hearts).second(), player1);
      const cardToPlay = behavior.cardToPlay(hand, trick, no_memory);
      expect(cardToPlay).toEqual(ace.of(Suit.Diamonds).first());
    });

    test("should play lowest trump, when mustn't serve", () => {
      let hand = new Hand([
        jack.of(Suit.Diamonds).first(),
        jack.of(Suit.Clubs),
        queen.of(Suit.Clubs),
      ]);
      const trick = new Trick(players);
      trick.add(ace.of(Suit.Hearts).second(), player1);
      const cardToPlay = behavior.cardToPlay(hand, trick, no_memory);
      expect(cardToPlay).toEqual(jack.of(Suit.Diamonds).first());
    });

    test("should play higher trump when mustn't serve and somebody else is trumping", () => {
      const trick = new Trick(players);
      trick.add(ace.of(Suit.Hearts).second(), player1);
      trick.add(ten.of(Suit.Diamonds).second(), player2);
      trick.add(ace.of(Suit.Diamonds).second(), player3);
      const cardToPlay = behavior.cardToPlay(hand, trick, no_memory);
      expect(cardToPlay).toEqual(jack.of(Suit.Diamonds).first());
    });

    test("should play jack, when mustn't serve and high value card isn't available", () => {
      let hand = new Hand([
        jack.of(Suit.Diamonds).first(),
        queen.of(Suit.Diamonds).first(),
        ten.of(Suit.Hearts),
      ]);
      const trick = new Trick(players);
      trick.add(ace.of(Suit.Hearts).second(), player1);
      const cardToPlay = behavior.cardToPlay(hand, trick, no_memory);
      expect(cardToPlay).toEqual(jack.of(Suit.Diamonds).first());
    });

    test("should play lowest card, when can't win because too many cards of suit in own hand", () => {
      const trick = new Trick(players);
      trick.add(king.of(Suit.Spades).second(), player1);
      const cardToPlay = behavior.cardToPlay(hand, trick, no_memory);
      expect(cardToPlay).toEqual(king.of(Suit.Spades).first());
    });

    test("should keep playing a card, if can't serve or trump a suit", () => {
      let hand = new Hand([king.of(Suit.Spades), ten.of(Suit.Spades)]);
      const trick = new Trick(players);
      trick.add(ace.of(Suit.Hearts).second(), player1);
      const cardToPlay = behavior.cardToPlay(hand, trick, no_memory);
      expect(cardToPlay).toEqual(expect.any(Card));
    });

    test("should keep playing a card, if can't win a trumped suit", () => {
      let hand = new Hand([jack.of(Suit.Spades), ten.of(Suit.Spades)]);
      const trick = new Trick(players);
      trick.add(ace.of(Suit.Hearts).second(), player1);
      trick.add(jack.of(Suit.Spades).second(), player2);
      const cardToPlay = behavior.cardToPlay(hand, trick, no_memory);
      expect(cardToPlay).toEqual(expect.any(Card));
    });

    test("should play ace because chance of winning", () => {
      let hand = new Hand([
        ace.of(Suit.Spades).first(),
        ace.of(Suit.Spades).second(),
        ten.of(Suit.Spades),
      ]);
      const trick = new Trick(players);
      trick.add(king.of(Suit.Spades), player3);
      trick.add(king.of(Suit.Spades), player2);
      const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
      expect(cardToPlay).toEqual(ace.of(Suit.Spades).first());
    });

    test("should play king because no chance of winning", () => {
      let hand = new Hand([
        ace.of(Suit.Spades).first(),
        ace.of(Suit.Spades).second(),
        ten.of(Suit.Spades).second(),
        king.of(Suit.Spades).second(),
      ]);
      const trick = new Trick(players);
      trick.add(king.of(Suit.Spades).first(), player3);
      trick.add(ten.of(Suit.Spades).first(), player2);
      const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
      expect(cardToPlay).toEqual(king.of(Suit.Spades).second());
    });

    test("should play ace, as 'best' solution by definition", () => {
      let hand = new Hand([
        ace.of(Suit.Diamonds).first(),
        ten.of(Suit.Hearts).second(),
        ten.of(Suit.Spades).second(),
        king.of(Suit.Spades).second(),
      ]);
      const trick = new Trick(players);
      trick.add(king.of(Suit.Clubs).first(), player3);
      trick.add(ace.of(Suit.Clubs).first(), player2);
      const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
      expect(cardToPlay).toEqual(ace.of(Suit.Diamonds).first());
    });
  });

  describe("Non-trump has been played already", () => {
    beforeEach(() => {
      players.forEach((playerLoop) => {
        playerLoop.memory.clearMemory();
      });
    });
    describe("Above 10 Points left in Suit", () => {
      beforeEach(() => {
        players.forEach((playerLoop) => {
          playerLoop.memory.memorizeMany([
            new PlayedCard(ace.of(Suit.Clubs).first(), player1),
            new PlayedCard(king.of(Suit.Clubs).first(), player2),
            new PlayedCard(ten.of(Suit.Clubs).first(), player3),
            new PlayedCard(ten.of(Suit.Clubs).second(), player4),
          ]);
        });
      });

      test("should keep playing a card, if can't play same suit", () => {
        let hand = new Hand([jack.of(Suit.Spades), ten.of(Suit.Diamonds)]);
        const trick = new Trick(players);
        const aceOfClubs = ace.of(Suit.Clubs).second();
        const jackOfDiamonds = jack.of(Suit.Diamonds).second();
        trick.add(aceOfClubs, player1);
        trick.add(jackOfDiamonds, player2);
        const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
        expect(cardToPlay).toEqual(expect.any(Card));
      });

      test("should start with ace of spades, ignoring already played suit, prefering over ace of hearts", () => {
        let hand = new Hand([
          ace.of(Suit.Spades).first(),
          ace.of(Suit.Clubs),
          ten.of(Suit.Clubs),
          ace.of(Suit.Hearts),
          ace.of(Suit.Diamonds),
        ]);
        const trick = new Trick(players);
        const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
        expect(cardToPlay).toEqual(ace.of(Suit.Spades).first());
      });

      test("should play lowest value trump, because can't win", () => {
        let hand = new Hand([
          ace.of(Suit.Diamonds),
          jack.of(Suit.Diamonds).first(),
          jack.of(Suit.Spades),
          queen.of(Suit.Diamonds),
        ]);
        const trick = new Trick(players);
        player1.memory.memorize(new PlayedCard(king.of(Suit.Spades), player2));
        trick.add(ten.of(Suit.Spades), player4);
        trick.add(king.of(Suit.Spades), player3);
        trick.add(queen.of(Suit.Spades), player2);
        const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
        expect(cardToPlay).toEqual(jack.of(Suit.Diamonds).first());
      });

      test("should play as high as possible, craving for trick", () => {
        let hand = new Hand([
          ace.of(Suit.Diamonds).first(),
          ten.of(Suit.Hearts).second(),
          jack.of(Suit.Spades).second(),
        ]);
        const trick = new Trick(players);
        trick.add(king.of(Suit.Clubs).second(), player3);
        trick.add(ace.of(Suit.Clubs).second(), player2);
        const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
        expect(cardToPlay).toEqual(ten.of(Suit.Hearts).second());
      });

      test("should play as high as possible, craving for trick, not knowing it will be 20 points for the suit", () => {
        let hand = new Hand([
          ace.of(Suit.Diamonds).first(),
          ten.of(Suit.Hearts).second(),
          jack.of(Suit.Spades).second(),
        ]);
        const trick = new Trick(players);
        trick.add(king.of(Suit.Clubs).second(), player3);
        const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
        expect(cardToPlay).toEqual(ten.of(Suit.Hearts).second());
      });

      test("should play position, as lowest trump higher than current wins the trick", () => {
        let hand = new Hand([
          ace.of(Suit.Diamonds).first(),
          ten.of(Suit.Hearts).second(),
          jack.of(Suit.Spades).second(),
        ]);
        const trick = new Trick(players);
        trick.add(king.of(Suit.Clubs).second(), player3);
        trick.add(ace.of(Suit.Clubs).second(), player2);
        trick.add(jack.of(Suit.Hearts).first(), player4);
        const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
        expect(cardToPlay).toEqual(jack.of(Suit.Spades).second());
      });

      test("should always play lowest value trump, because trick is lost", () => {
        let hand = new Hand([
          ten.of(Suit.Hearts).second(),
          queen.of(Suit.Spades).second(),
        ]);
        const trick = new Trick(players);
        trick.add(king.of(Suit.Clubs).first(), player3);
        trick.add(ace.of(Suit.Clubs).first(), player2);
        trick.add(ten.of(Suit.Hearts).first(), player4);
        const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
        expect(cardToPlay).toEqual(queen.of(Suit.Spades).second());
      });
    });

    describe("Less than 10 Points left in Suit", () => {
      beforeEach(() => {
        players.forEach((playerLoop) => {
          playerLoop.memory.memorizeMany([
            new PlayedCard(ace.of(Suit.Clubs).first(), player1),
            new PlayedCard(ace.of(Suit.Clubs).second(), player2),
            new PlayedCard(ten.of(Suit.Clubs).first(), player3),
            new PlayedCard(ten.of(Suit.Clubs).second(), player4),
          ]);
        });
      });

      test("should keep playing a card, if can't play same suit", () => {
        let hand = new Hand([jack.of(Suit.Spades), ten.of(Suit.Diamonds)]);
        const trick = new Trick(players);
        const aceOfClubs = ace.of(Suit.Clubs).second();
        const jackOfDiamonds = jack.of(Suit.Diamonds).second();
        trick.add(aceOfClubs, player1);
        trick.add(jackOfDiamonds, player2);
        const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
        expect(cardToPlay).toEqual(expect.any(Card));
      });

      test("should start with ace of spades, ignoring already played suit, prefering over ace of hearts", () => {
        let hand = new Hand([
          ace.of(Suit.Spades).first(),
          ace.of(Suit.Clubs),
          ten.of(Suit.Clubs),
          ace.of(Suit.Hearts),
          ace.of(Suit.Diamonds),
        ]);
        const trick = new Trick(players);
        const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
        expect(cardToPlay).toEqual(ace.of(Suit.Spades).first());
      });

      test("should play position, as lowest trump higher than current wins the trick", () => {
        let hand = new Hand([
          ace.of(Suit.Diamonds).first(),
          jack.of(Suit.Clubs).second(),
          jack.of(Suit.Spades).second(),
        ]);
        const trick = new Trick(players);
        trick.add(king.of(Suit.Clubs).first(), player3);
        trick.add(king.of(Suit.Clubs).second(), player2);
        trick.add(jack.of(Suit.Hearts).first(), player4);
        const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
        expect(cardToPlay).toEqual(jack.of(Suit.Spades).second());
      });
    });
  });

  describe("Standard Trump play", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      players.forEach((p) => p.memory.clearMemory());
    });

    test("should play highest card when fox is in trick no matter what", () => {
      let hand = new Hand([
        ten.of(Suit.Hearts).first(),
        king.of(Suit.Diamonds).first(),
        queen.of(Suit.Spades).first(),
      ]);
      const trick = new Trick(players);
      trick.add(ace.of(Suit.Diamonds), player2);
      const cardToPlay = behavior.cardToPlay(hand, trick);
      expect(cardToPlay).toEqual(ten.of(Suit.Hearts).first());
    });

    test("shouldn't play highest card when fox is in trick because wouldn't win", () => {
      let hand = new Hand([
        ten.of(Suit.Hearts).first(),
        king.of(Suit.Diamonds).first(),
        queen.of(Suit.Spades).first(),
      ]);
      const trick = new Trick(players);
      trick.add(ace.of(Suit.Diamonds), player2);
      trick.add(ten.of(Suit.Hearts), player3);
      const cardToPlay = behavior.cardToPlay(hand, trick);
      expect(cardToPlay).toEqual(king.of(Suit.Diamonds).first());
    });
  });

  describe("Knowing your teammate", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      player1.isRe = jest.fn().mockReturnValue(true);
      player2.isRe = jest.fn().mockReturnValue(true);
      player3.isRe = jest.fn().mockReturnValue(false);
      player4.isRe = jest.fn().mockReturnValue(false);
      players.forEach((p) => {
        p.memory.clearMemory();
        p.behavior.affinities.setPlayers(players);
        p.behavior.affinities.declaresParty(player2);
      });
      behavior.affinities.setPlayers(players);
      behavior.affinities.declaresParty(player2);
    });

    test("should play suit already thrown by teammate", () => {
      let hand = new Hand([
        ten.of(Suit.Spades).first(),
        king.of(Suit.Spades).first(),
        jack.of(Suit.Spades).first(),
      ]);
      player1.memory.hasSuitBeenThrownByPlayer = jest
        .fn()
        .mockImplementation(
          (suit, player) => suit === Suit.Spades && player.id === player2.id
        );
      const cardToPlay = behavior.cardToPlay(
        hand,
        new Trick(players),
        player1.memory
      );
      expect(cardToPlay).toEqual(ten.of(Suit.Spades).first());
    });

    test("shouldn't play suit thrown by teammate because enemy has thrown too", () => {
      let hand = new Hand([
        ten.of(Suit.Spades).first(),
        king.of(Suit.Spades).first(),
        jack.of(Suit.Spades).first(),
      ]);
      player1.memory.hasSuitBeenThrownByPlayer = jest
        .fn()
        .mockImplementation(
          (suit, player) =>
            suit === Suit.Spades &&
            (player.id === player2.id || player.id === player4.id)
        );
      const cardToPlay = behavior.cardToPlay(
        hand,
        new Trick(players),
        player1.memory
      );
      expect(cardToPlay).toEqual(jack.of(Suit.Spades).first());
    });

    test("should suggest player is kontra and grease", () => {
      let hand = new Hand([
        ace.of(Suit.Diamonds).first(),
        jack.of(Suit.Diamonds).first(),
        queen.of(Suit.Diamonds).first(),
      ]);
      const trick = new Trick(players);
      trick.add(queen.of(Suit.Clubs), player1);
      trick.add(jack.of(Suit.Spades), player2);
      trick.add(ten.of(Suit.Hearts), player3);
      expect(player4.behavior.affinities.for(player3)).toEqual(1);
      const cardToPlay = player4.behavior.cardToPlay(
        hand,
        trick,
        player4.memory
      );
      expect(cardToPlay).toEqual(ace.of(Suit.Diamonds).first());
    });

    test("should suggest player is re", () => {
      const trick = new Trick(players);
      trick.add(queen.of(Suit.Clubs), player2);
      trick.add(ace.of(Suit.Diamonds), player1);
      expect(player2.behavior.affinities.for(player1)).toEqual(1);
      expect(player3.behavior.affinities.for(player1)).toEqual(-1);
      expect(player4.behavior.affinities.for(player1)).toEqual(-1);
      expect(player3.behavior.affinities.for(player4)).toEqual(1);
      expect(player4.behavior.affinities.for(player3)).toEqual(1);
    });

    test("should suggest player is kontra because didn't grease", () => {
      const trick = new Trick(players);
      trick.add(jack.of(Suit.Spades), player1);
      trick.add(queen.of(Suit.Clubs), player2);
      trick.add(jack.of(Suit.Hearts), player3);
      trick.add(jack.of(Suit.Diamonds), player4);
      expect(player1.behavior.affinities.for(player4)).toEqual(-1);
      expect(player2.behavior.affinities.for(player4)).toEqual(-1);
      expect(player3.behavior.affinities.for(player4)).toEqual(1);
    });

    test("should grease, speculating teammate will win on last position", () => {
      let hand = new Hand([
        ace.of(Suit.Diamonds).first(),
        jack.of(Suit.Clubs).first(),
      ]);
      const trick = new Trick(players);
      trick.add(jack.of(Suit.Spades), player3);
      trick.add(jack.of(Suit.Spades), player4);
      const cardToPlay = behavior.cardToPlay(hand, trick);
      expect(cardToPlay).toEqual(ace.of(Suit.Diamonds).first());
    });

    test("shouldn't grease, since highest card is too high", () => {
      let hand = new Hand([
        ace.of(Suit.Diamonds).first(),
        jack.of(Suit.Clubs).first(),
      ]);
      const trick = new Trick(players);
      trick.add(queen.of(Suit.Hearts), player3);
      const cardToPlay = behavior.cardToPlay(hand, trick);
      expect(cardToPlay).toEqual(jack.of(Suit.Clubs).first());
    });

    test("shouldn't grease, since teammate isn't on last position", () => {
      let hand = new Hand([
        ace.of(Suit.Diamonds).first(),
        jack.of(Suit.Clubs).first(),
      ]);
      const trick = new Trick(players);
      trick.add(jack.of(Suit.Spades), player3);
      const play = jest.spyOn(RuleBasedBehaviour.prototype, "defaultPlay");
      const cardToPlay = player1.behavior.cardToPlay(hand, trick);
      expect(play).toHaveBeenCalled();
      expect(cardToPlay).toEqual(expect.any(Card));
    });

    describe("When losing, play least valuable card", () => {
      test("when trick is lost on position", () => {
        let hand = new Hand([
          ace.of(Suit.Diamonds).first(),
          jack.of(Suit.Diamonds).first(),
          queen.of(Suit.Diamonds).first(),
        ]);
        const trick = new Trick(players);
        trick.add(queen.of(Suit.Hearts).first(), player2);
        trick.add(queen.of(Suit.Spades).first(), player3);
        trick.add(ten.of(Suit.Hearts).first(), player4);
        const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
        expect(cardToPlay).toEqual(jack.of(Suit.Diamonds).first());
      });

      test("when highest card has been played", () => {
        let hand = new Hand([
          ace.of(Suit.Diamonds).first(),
          jack.of(Suit.Diamonds).first(),
          queen.of(Suit.Diamonds).first(),
        ]);
        const trick = new Trick(players);
        trick.add(ten.of(Suit.Hearts).first(), player3);
        const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
        expect(cardToPlay).toEqual(jack.of(Suit.Diamonds).first());
      });

      test("when highest left over card has been played", () => {
        let hand = new Hand([
          ace.of(Suit.Diamonds).first(),
          jack.of(Suit.Diamonds).first(),
          queen.of(Suit.Diamonds).first(),
        ]);
        const trick = new Trick(players);
        player1.memory.memorizeMany([
          new PlayedCard(ten.of(Suit.Hearts).first(), player3),
          new PlayedCard(ten.of(Suit.Hearts).second(), player3),
        ]);
        trick.add(queen.of(Suit.Clubs).first(), player3);
        const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
        expect(cardToPlay).toEqual(jack.of(Suit.Diamonds).first());
      });
    });

    describe("Greasing your teammate", () => {
      describe("Card Order", () => {
        test("should grease fox", () => {
          let hand = new Hand([
            ace.of(Suit.Diamonds).first(),
            jack.of(Suit.Clubs).first(),
            king.of(Suit.Diamonds).first(),
          ]);
          const cardToPlay = behavior.findMostSuitableGreasingCard(hand);
          expect(cardToPlay).toEqual(ace.of(Suit.Diamonds).first());
        });

        test("shouldn't grease queen, although more points", () => {
          let hand = new Hand([
            jack.of(Suit.Diamonds).first(),
            jack.of(Suit.Clubs).first(),
            queen.of(Suit.Diamonds).first(),
          ]);
          const cardToPlay = behavior.findMostSuitableGreasingCard(hand);
          expect(cardToPlay).toEqual(jack.of(Suit.Diamonds).first());
        });

        test("should pick lowest suit", () => {
          let hand = new Hand([
            jack.of(Suit.Diamonds).first(),
            jack.of(Suit.Hearts).first(),
            jack.of(Suit.Clubs).first(),
          ]);
          const cardToPlay = behavior.findMostSuitableGreasingCard(hand);
          expect(cardToPlay).toEqual(jack.of(Suit.Diamonds).first());
        });
      });

      describe("On Position - easy decisions", () => {
        test("should grease with trump", () => {
          let hand = new Hand([
            ace.of(Suit.Diamonds).first(),
            jack.of(Suit.Clubs).first(),
            ten.of(Suit.Diamonds).first(),
          ]);
          const trick = new Trick(players);
          trick.add(queen.of(Suit.Hearts).first(), player2);
          trick.add(jack.of(Suit.Clubs).first(), player3);
          trick.add(jack.of(Suit.Hearts).first(), player4);
          const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
          expect(cardToPlay).toEqual(ace.of(Suit.Diamonds).first());
        });

        test("should grease with non-trump", () => {
          let hand = new Hand([
            ten.of(Suit.Diamonds).first(),
            ace.of(Suit.Spades).first(),
            king.of(Suit.Spades).first(),
          ]);
          const trick = new Trick(players);
          trick.add(ace.of(Suit.Spades).second(), player2);
          trick.add(king.of(Suit.Spades).second(), player3);
          trick.add(ten.of(Suit.Spades).second(), player4);
          const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
          expect(cardToPlay).toEqual(ace.of(Suit.Spades).first());
        });

        test("shouldn't win the trick, greasing teammate with non-trump", () => {
          let hand = new Hand([
            ten.of(Suit.Diamonds).first(),
            ace.of(Suit.Clubs).first(),
            king.of(Suit.Clubs).first(),
          ]);
          const trick = new Trick(players);
          trick.add(ace.of(Suit.Spades).second(), player2);
          trick.add(king.of(Suit.Spades).second(), player3);
          trick.add(ten.of(Suit.Spades).second(), player4);
          const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
          expect(cardToPlay).toEqual(ace.of(Suit.Clubs).first());
        });

        test("shouldn't grease with ten of hearts, although highest value", () => {
          let hand = new Hand([
            ten.of(Suit.Hearts).first(),
            king.of(Suit.Clubs).first(),
          ]);
          const trick = new Trick(players);
          trick.add(ace.of(Suit.Spades).second(), player2);
          trick.add(king.of(Suit.Spades).second(), player3);
          trick.add(ten.of(Suit.Spades).second(), player4);
          const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
          expect(cardToPlay).toEqual(king.of(Suit.Clubs).first());
        });
      });

      describe("On Memory and or Hand - easy decisions with perfect memory", () => {
        test("should grease with trump, knowing trick will be won anyway", () => {
          let hand = new Hand([
            ten.of(Suit.Diamonds).first(),
            ace.of(Suit.Clubs).first(),
            jack.of(Suit.Clubs).first(),
          ]);
          const trick = new Trick(players);
          trick.add(ten.of(Suit.Hearts).second(), player2);
          const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
          expect(cardToPlay).toEqual(ten.of(Suit.Diamonds).first());
        });

        test("should grease with trump, knowing highest remaining card was played", () => {
          let hand = new Hand([
            ten.of(Suit.Diamonds).first(),
            ace.of(Suit.Clubs).first(),
            jack.of(Suit.Clubs).first(),
          ]);
          const trick = new Trick(players);
          player1.memory.memorizeMany([
            new PlayedCard(ten.of(Suit.Hearts).first(), player3),
            new PlayedCard(ten.of(Suit.Hearts).second(), player4),
          ]);
          trick.add(queen.of(Suit.Clubs).second(), player2);
          const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
          expect(cardToPlay).toEqual(ten.of(Suit.Diamonds).first());
        });

        test("should grease with trump, knowing self owns only remaining better trumps", () => {
          let hand = new Hand([
            ten.of(Suit.Hearts).first(),
            ace.of(Suit.Diamonds).first(),
            jack.of(Suit.Clubs).first(),
          ]);
          const trick = new Trick(players);
          player1.memory.memorize(
            new PlayedCard(ten.of(Suit.Hearts).second(), player3)
          );
          trick.add(queen.of(Suit.Clubs).second(), player2);
          const cardToPlay = behavior.cardToPlay(hand, trick, player1.memory);
          expect(cardToPlay).toEqual(ace.of(Suit.Diamonds).first());
        });
      });
    });
  });
});
