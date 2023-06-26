import { Player } from "@/models/player";
import { Game } from "@/models/game";
import { Hand } from "@/models/hand";
import { PlayedCard } from "@/models/playedCard";
import { king, queen, ten, Suit } from "@/models/card";
import { TrickStack } from "@/models/trickStack";
import { notifier } from "@/models/notifier";
import { options } from "@/models/options";
import { Announcement } from "@/models/announcements";
import { Trick } from "@/models/trick";
import { Affinities } from "@/models/affinities";
import { aHandWith, aHandWithout } from "../../builders/handBuilder";
import { Reservation } from "@/models/reservations";

let game: Game;
let player: Player;

jest.useFakeTimers();

beforeEach(() => {
  game = Game.singlePlayer();
  player = game.players[0];
  game.currentRound.waitingForPlayer = () => player;
  options.autoplay = false;
  jest.runAllTimers();
});

test("player has a name", () => {
  expect(player.name).toBeDefined();
});

test("player has a position", () => {
  expect(player.tablePosition).toBeDefined();
});

test("player is not human by default", () => {
  expect(new Player("some player").isHuman).toBe(false);
});

test("player has a trick stack", () => {
  expect(new Player("some player").trickStack).toBeDefined();
  expect(new Player("some player").trickStack instanceof TrickStack).toBe(true);
});

test("should belong to re party", () => {
  player.hand = new Hand([queen.of(Suit.Clubs)]);

  expect(player.isRe()).toBe(true);
  expect(player.isKontra()).toBe(false);
});

test("should belong to kontra party", () => {
  player.hand = new Hand([queen.of(Suit.Spades)]);

  expect(player.isRe()).toBe(false);
  expect(player.isKontra()).toBe(true);
});

test("player can play card from hand", async () => {
  const kingOnHand = king.of(Suit.Diamonds);
  const queenOnHand = queen.of(Suit.Spades);
  player.hand = new Hand([kingOnHand, queenOnHand]);

  await player.play(kingOnHand);

  expect(player.hand.cards).not.toContain(kingOnHand);
  expect(player.hand.cards).toContain(queenOnHand);
});

test("should move to next player after playing a card", async () => {
  player.game!.currentRound.nextPlayer = jest.fn();
  const kingOnHand = king.of(Suit.Diamonds);
  player.hand = new Hand([kingOnHand]);

  await player.play(kingOnHand);

  expect(player.game!.currentRound.nextPlayer).toHaveBeenCalled();
});

test("should trigger next move if autoplay option is enabled", async () => {
  options.autoplay = true;
  expect.assertions(1);
  const nextMoveMock = jest.fn();
  player.game!.currentRound.nextMove = nextMoveMock;
  const kingOnHand = king.of(Suit.Diamonds);
  player.hand = new Hand([kingOnHand]);

  let promise = player.play(kingOnHand);
  jest.runAllTimers();
  await promise;

  expect(nextMoveMock).toHaveBeenCalled();
});

test("should not trigger next move if autoplay option is disabled", async () => {
  options.autoplay = false;
  expect.assertions(1);
  const nextMoveMock = jest.fn();
  player.game!.currentRound.nextMove = nextMoveMock;
  const kingOnHand = king.of(Suit.Diamonds);
  player.hand = new Hand([kingOnHand]);

  const promise = player.play(kingOnHand);
  jest.runAllTimers();
  await promise;

  expect(nextMoveMock).not.toHaveBeenCalled();
});

test("playing a card adds it to the current trick", async () => {
  const queenOnHand = queen.of(Suit.Spades);
  player.hand = new Hand([queenOnHand]);

  await player.play(queenOnHand);

  const expectedCard = new PlayedCard(queenOnHand, player);

  expect(game.currentTrick.cards()).toEqual([expectedCard]);
});

test("player cannot play card that is not on their hand", () => {
  player.hand = new Hand([king.of(Suit.Diamonds)]);

  async function invalidMove() {
    await player.play(queen.of(Suit.Diamonds));
  }

  expect(invalidMove()).rejects.toThrowError(
    "can't play a card that's not on the player's hand"
  );
});

test("player cannot play undefined card", () => {
  player.hand = new Hand([king.of(Suit.Diamonds)]);

  async function invalidMove() {
    await player.play(king.of(Suit.Clubs));
  }

  expect(invalidMove()).rejects.toThrowError(
    "can't play a card that's not on the player's hand"
  );
});

test("player can win a trick", () => {
  const trick = new Trick(Array.of(player));
  trick.add(king.of(Suit.Diamonds), player);

  player.win(trick);

  expect(player.trickStack.tricks).toEqual([trick]);
});

test("should autoplay a card", async () => {
  const queenOnHand = queen.of(Suit.Spades);
  const kingOnHand = king.of(Suit.Diamonds);
  player.game!.currentTrick.baseCard = () => queen.of(Suit.Diamonds);
  player.hand = new Hand([queenOnHand, kingOnHand]);
  player.behavior = {
    playerId: player.id,
    affinities: new Affinities(player),
    reset: jest.fn(() => null),
    cardToPlay: jest.fn(() => kingOnHand),
    announcementToMake: jest.fn(() => null),
    handleAffinityEvent: jest.fn(() => null),
    reservationToDeclare: () => Reservation.Healthy,
  };

  await player.autoplay();

  expect(player.hand.cards).not.toContain(kingOnHand);
  expect(player.behavior.cardToPlay).toBeCalledWith(
    player.hand,
    player.game!.currentTrick,
    player.memory
  );
});

test("should try to make an announcement", async () => {
  player.hand = aHandWith(10);
  game.currentRound.waitingForPlayer = () => game.players[0];
  player.behavior = {
    playerId: player.id,
    affinities: new Affinities(player),
    reset: jest.fn(() => null),
    cardToPlay: jest.fn(() => player.hand.cards[0]),
    announcementToMake: jest.fn(() => null),
    handleAffinityEvent: jest.fn(() => null),
    reservationToDeclare: () => Reservation.Healthy,
  };

  await player.autoplay();

  expect(player.behavior.announcementToMake).toBeCalledWith(
    expect.any(Set),
    expect.any(Hand)
  );
});

test("should not play a card if its not the players turn", async () => {
  const queenOnHand = queen.of(Suit.Spades);
  player.hand = new Hand([queenOnHand]);
  game.currentRound.waitingForPlayer = () => game.players[1];

  await player.play(queenOnHand);

  expect(player.hand.cards).toContain(queenOnHand);
});

test("should show notification if trying to play a card when its not your turn", async () => {
  const queenOnHand = queen.of(Suit.Spades);
  player.hand = new Hand([queenOnHand]);
  game.currentRound.waitingForPlayer = () => game.players[1];

  await player.play(queenOnHand);

  expect(notifier.notifications[0].text).toBe("not-your-turn");
});

test("should not play card and show notification if trying to play an invalid card", async () => {
  const queenOnHand = queen.of(Suit.Spades);
  const tenOnHand = ten.of(Suit.Spades);
  player.hand = new Hand([queenOnHand, tenOnHand]);
  game.currentRound.waitingForPlayer = () => player;
  game.currentTrick.baseCard = () => ten.of(Suit.Spades);

  await player.play(queenOnHand);

  expect(player.hand.cards).toContain(queenOnHand);
  expect(notifier.notifications[0].text).toBe("cant-play-card");
});

test("should validate playable cards", () => {
  const queenOnHand = queen.of(Suit.Spades);
  const tenOnHand = ten.of(Suit.Spades);
  player.hand = new Hand([queenOnHand, tenOnHand]);

  game.currentTrick.baseCard = () => ten.of(Suit.Spades);

  expect(player.canPlay(queenOnHand)).toBe(false);
  expect(player.canPlay(tenOnHand)).toBe(true);
});

test("should validate playable cards if no card has been played yet", () => {
  const queenOnHand = queen.of(Suit.Spades);
  const tenOnHand = ten.of(Suit.Spades);
  player.hand = new Hand([queenOnHand, tenOnHand]);

  game.currentTrick.baseCard = () => undefined;

  expect(player.canPlay(queenOnHand)).toBe(true);
  expect(player.canPlay(tenOnHand)).toBe(true);
});

test("should clear trick stack when resetting player", () => {
  const trick = new Trick(game.players);
  trick.add(queen.of(Suit.Clubs), game.players[0]);
  trick.add(queen.of(Suit.Spades), game.players[1]);
  trick.add(queen.of(Suit.Hearts), game.players[2]);
  trick.add(queen.of(Suit.Diamonds), game.players[3]);
  player.win(trick);

  expect(player.trickStack).not.toEqual(new TrickStack());
  player.reset();

  expect(player.trickStack).toEqual(new TrickStack());
});

test("should be able to play card directly, when it's your turn", async () => {
  const trick = new Trick(game.players);
  trick.add(queen.of(Suit.Clubs), player);
  trick.add(queen.of(Suit.Spades), game.players[1]);
  trick.add(queen.of(Suit.Hearts), game.players[2]);
  trick.add(queen.of(Suit.Diamonds), game.players[3]);
  game.currentRound.currentTrick = trick;
  const tenOfClubs = ten.of(Suit.Clubs);
  player.hand = new Hand([tenOfClubs]);

  await player.play(tenOfClubs);

  expect(game.currentRound.currentTrick).not.toEqual(trick);
  expect(game.currentRound.currentTrick.playedCards.length).toEqual(1);
});

test("shouldn't be able to play card directly, when it's not your turn", async () => {
  const trick = new Trick(game.players);
  trick.add(queen.of(Suit.Clubs), player);
  trick.add(ten.of(Suit.Hearts), game.players[1]);
  trick.add(queen.of(Suit.Hearts), game.players[2]);
  trick.add(queen.of(Suit.Diamonds), game.players[3]);
  game.currentRound.currentTrick = trick;
  const tenOfClubs = ten.of(Suit.Clubs);
  player.hand = new Hand([tenOfClubs]);

  await player.play(tenOfClubs);

  expect(notifier.notifications[0].text).toBe("not-your-turn");
});

test("should clear announcements when resetting player", () => {
  player.announce(player.isRe() ? Announcement.Re : Announcement.Kontra);

  player.reset();

  expect(player.announcements).toEqual(new Set());
});

test("should clear reservation when resetting player", () => {
  player.declareReservation(Reservation.JackSolo);

  expect(player.reservation).toEqual(Reservation.JackSolo);

  player.reset();

  expect(player.reservation).toEqual(Reservation.None);
});

test("should throw error when prompting human player for reservation and they haven't decided yet", () => {
  expect(player.reservation).toEqual(Reservation.None);

  const failingPrompt = () => player.promptForReservation();

  expect(failingPrompt).toThrowError(
    "human player didn't declare a reservation"
  );
});

test("should return behavior-based reservation for non-human players", () => {
  const computerPlayer = game.players[1];
  computerPlayer.behavior.reservationToDeclare = () => Reservation.AceSolo;

  const reservation = computerPlayer.promptForReservation();

  expect(reservation).toEqual(Reservation.AceSolo);
});

describe("announcements", () => {
  test("should announce", () => {
    player.hand = aHandWith(10, queen.of(Suit.Clubs));

    player.announce(Announcement.Re);

    expect(player.announcements).toContain(Announcement.Re);
  });

  test("should validate announcement", () => {
    player.hand = aHandWith(7, queen.of(Suit.Clubs));

    const failingAnnouncement = () => player.announce(Announcement.No90);

    expect(failingAnnouncement).toThrowError("Invalid announcement");
  });

  test("should automatically announce previous steps", () => {
    player.hand = aHandWith(10, queen.of(Suit.Clubs));

    player.announce(Announcement.NoPoints);

    expect(player.announcements).toEqual(
      new Set([
        Announcement.Re,
        Announcement.No90,
        Announcement.No60,
        Announcement.No30,
        Announcement.NoPoints,
      ])
    );
  });

  test("should be able to announce 're' when player is re", () => {
    player.hand = aHandWith(10, queen.of(Suit.Clubs));

    let possibleAnnouncements = player.possibleAnnouncements();

    let expectedAnnouncements = new Set([
      Announcement.Re,
      Announcement.No90,
      Announcement.No60,
      Announcement.No30,
      Announcement.NoPoints,
    ]);
    expect(possibleAnnouncements).toEqual(expectedAnnouncements);
  });

  test("should be able to announce 'kontra' when player is kontra", () => {
    player.hand = aHandWithout(9, queen.of(Suit.Clubs));

    let possibleAnnouncements = player.possibleAnnouncements();

    let expectedAnnouncements = new Set([
      Announcement.Kontra,
      Announcement.No90,
      Announcement.No60,
      Announcement.No30,
      Announcement.NoPoints,
    ]);
    expect(possibleAnnouncements).toEqual(expectedAnnouncements);
  });

  const announcementThreholds = [
    {
      numberOfCards: 8,
      previousAnnouncements: [Announcement.Re],
      expectedAnnouncements: [
        Announcement.No90,
        Announcement.No60,
        Announcement.No30,
        Announcement.NoPoints,
      ],
    },
    {
      numberOfCards: 8,
      previousAnnouncements: [],
      expectedAnnouncements: [],
    },
    {
      numberOfCards: 7,
      previousAnnouncements: [Announcement.Re, Announcement.No90],
      expectedAnnouncements: [
        Announcement.No60,
        Announcement.No30,
        Announcement.NoPoints,
      ],
    },
    {
      numberOfCards: 7,
      previousAnnouncements: [Announcement.Re],
      expectedAnnouncements: [],
    },
    {
      numberOfCards: 6,
      previousAnnouncements: [
        Announcement.Re,
        Announcement.No90,
        Announcement.No60,
      ],
      expectedAnnouncements: [Announcement.No30, Announcement.NoPoints],
    },
    {
      numberOfCards: 6,
      previousAnnouncements: [Announcement.Re, Announcement.No90],
      expectedAnnouncements: [],
    },
    {
      numberOfCards: 5,
      previousAnnouncements: [
        Announcement.Re,
        Announcement.No90,
        Announcement.No60,
        Announcement.No30,
      ],
      expectedAnnouncements: [Announcement.NoPoints],
    },
    {
      numberOfCards: 5,
      previousAnnouncements: [
        Announcement.Re,
        Announcement.No90,
        Announcement.No60,
      ],
      expectedAnnouncements: [],
    },
  ];

  test.each(announcementThreholds)(
    "should respect announcement thresholds",
    ({ numberOfCards, previousAnnouncements, expectedAnnouncements }) => {
      player.hand = aHandWith(numberOfCards, queen.of(Suit.Clubs));
      previousAnnouncements.forEach((a) => player.announcements.add(a));

      const possibleAnnouncements = player.possibleAnnouncements();

      expect([...possibleAnnouncements]).toEqual(expectedAnnouncements);
    }
  );

  test("should not be able to make same announcement twice", () => {
    player.hand = aHandWith(9, queen.of(Suit.Clubs));
    [
      Announcement.Re,
      Announcement.No90,
      Announcement.No60,
      Announcement.No30,
      Announcement.NoPoints,
    ].forEach((a) => player.announcements.add(a));

    let possibleAnnouncements = player.possibleAnnouncements();

    expect(possibleAnnouncements).toEqual(new Set());
  });

  test("shouldn't be able to announce same as teammate", () => {
    let player2 = game.players[1];
    player.hand = aHandWith(9, queen.of(Suit.Clubs));
    player2.hand = aHandWith(9, queen.of(Suit.Clubs));
    player.announce(Announcement.Re);

    let failingAnnouncement = () => player2.announce(Announcement.Re);

    expect(player2.possibleAnnouncements()).not.toContain(Announcement.Re);
    expect(failingAnnouncement).toThrowError("Invalid announcement");
  });

  test("should be able to announce after teammate", () => {
    let player2 = game.players[1];
    player.hand = aHandWith(9, queen.of(Suit.Clubs));
    player2.hand = aHandWith(8, queen.of(Suit.Clubs));
    player.announce(Announcement.Re);
    player2.announce(Announcement.No90);

    expect(player.possibleAnnouncements()).not.toContain(Announcement.No90);
  });
});
