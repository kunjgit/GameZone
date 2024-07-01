import { Announcement } from "@/models/announcements";
import { queen, Suit } from "@/models/card";
import { Game } from "@/models/game";
import { Hand } from "@/models/hand";
import { PartyName } from "@/models/party";
import { Player } from "@/models/player";
import { PartyBuilder } from "../../builders/partyBuilder";

describe("Affinities", () => {
  describe("Normal game - 1,2 vs. 3,4", () => {
    const reParty = new PartyBuilder(PartyName.Re).build();
    const kontraParty = new PartyBuilder(PartyName.Kontra).build();
    const player1 = reParty.players[0];
    const player2 = reParty.players[1];
    const player3 = kontraParty.players[0];
    const player4 = kontraParty.players[1];
    const players = [player1, player2, player3, player4];
    let game = new Game(players);

    beforeEach(() => {
      game = new Game(players);
      player1.reset();
      player2.reset();
      player3.reset();
      player4.reset();
      player1.behavior.affinities.setPlayers(players);
      player2.behavior.affinities.setPlayers(players);
      player3.behavior.affinities.setPlayers(players);
      player4.behavior.affinities.setPlayers(players);
      player2.possibleAnnouncements = () =>
        new Set([Announcement.Re, Announcement.No90]);
      player3.possibleAnnouncements = () =>
        new Set([Announcement.Kontra, Announcement.No90]);

      expect(player1.isRe()).toEqual(true);
      expect(player2.isRe()).toEqual(true);
      expect(player3.isKontra()).toEqual(true);
      expect(player4.isKontra()).toEqual(true);
    });

    test("Affinities are resettable", () => {
      player1.announce(Announcement.Re);
      expect(player2.behavior.affinities.for(player1)).toEqual(1);
      expect(player2.behavior.affinities.for(player3)).toEqual(-1);
      expect(player2.behavior.affinities.for(player4)).toEqual(-1);
      player2.behavior.reset();
      expect(player2.behavior.affinities.for(player1)).toEqual(0);
      expect(player2.behavior.affinities.for(player3)).toEqual(0);
      expect(player2.behavior.affinities.for(player4)).toEqual(0);
    });

    test("Re announces", () => {
      player2.announce(Announcement.Re);
      expect(player1.behavior.affinities.for(player2)).toEqual(1);
      expect(player1.behavior.affinities.for(player3)).toEqual(-1);
      expect(player1.behavior.affinities.for(player4)).toEqual(-1);
      expect(player3.behavior.affinities.for(player1)).toEqual(0);
      expect(player3.behavior.affinities.for(player2)).toEqual(-1);
      expect(player3.behavior.affinities.for(player4)).toEqual(0);
      expect(player4.behavior.affinities.for(player1)).toEqual(0);
      expect(player4.behavior.affinities.for(player2)).toEqual(-1);
      expect(player4.behavior.affinities.for(player3)).toEqual(0);
    });

    test("Re announces twice", () => {
      player2.announce(Announcement.Re);
      player2.announce(Announcement.No90);
      expect(player1.behavior.affinities.for(player2)).toEqual(1);
      expect(player1.behavior.affinities.for(player3)).toEqual(-1);
      expect(player1.behavior.affinities.for(player4)).toEqual(-1);
      expect(player3.behavior.affinities.for(player1)).toEqual(0);
      expect(player3.behavior.affinities.for(player2)).toEqual(-1);
      expect(player3.behavior.affinities.for(player4)).toEqual(0);
      expect(player4.behavior.affinities.for(player1)).toEqual(0);
      expect(player4.behavior.affinities.for(player2)).toEqual(-1);
      expect(player4.behavior.affinities.for(player3)).toEqual(0);
    });

    test("Kontra announces", () => {
      player3.announce(Announcement.Kontra);
      expect(player1.behavior.affinities.for(player2)).toEqual(0);
      expect(player1.behavior.affinities.for(player3)).toEqual(-1);
      expect(player1.behavior.affinities.for(player4)).toEqual(0);
      expect(player2.behavior.affinities.for(player1)).toEqual(0);
      expect(player2.behavior.affinities.for(player3)).toEqual(-1);
      expect(player2.behavior.affinities.for(player4)).toEqual(0);
      expect(player4.behavior.affinities.for(player1)).toEqual(-1);
      expect(player4.behavior.affinities.for(player2)).toEqual(-1);
      expect(player4.behavior.affinities.for(player3)).toEqual(1);
    });

    test("Both announce", () => {
      player1.announce(Announcement.Re);
      player3.announce(Announcement.Kontra);
      expect(player1.behavior.affinities.for(player2)).toEqual(0);
      expect(player1.behavior.affinities.for(player3)).toEqual(-1);
      expect(player1.behavior.affinities.for(player4)).toEqual(0);
      expect(player2.behavior.affinities.for(player1)).toEqual(1);
      expect(player2.behavior.affinities.for(player3)).toEqual(-1);
      expect(player2.behavior.affinities.for(player4)).toEqual(-1);
      expect(player3.behavior.affinities.for(player1)).toEqual(-1);
      expect(player3.behavior.affinities.for(player2)).toEqual(0);
      expect(player3.behavior.affinities.for(player4)).toEqual(0);
      expect(player4.behavior.affinities.for(player1)).toEqual(-1);
      expect(player4.behavior.affinities.for(player2)).toEqual(-1);
      expect(player4.behavior.affinities.for(player3)).toEqual(1);
    });

    test("Kontra announced, responded with No90", () => {
      player3.announce(Announcement.Kontra);
      player4.announce(Announcement.No90);
      expect(player1.behavior.affinities.for(player2)).toEqual(1);
      expect(player1.behavior.affinities.for(player3)).toEqual(-1);
      expect(player1.behavior.affinities.for(player4)).toEqual(-1);
      expect(player2.behavior.affinities.for(player1)).toEqual(1);
      expect(player2.behavior.affinities.for(player3)).toEqual(-1);
      expect(player2.behavior.affinities.for(player4)).toEqual(-1);
      expect(player4.behavior.affinities.for(player1)).toEqual(-1);
      expect(player4.behavior.affinities.for(player2)).toEqual(-1);
      expect(player4.behavior.affinities.for(player3)).toEqual(1);
    });

    test("Queen of clubs played", async () => {
      game.currentRound.playerOrder.prioritize(player2);
      player2.hand = new Hand([queen.of(Suit.Clubs).first()]);
      await player2.play(player2.hand.highest());
      expect(player1.behavior.affinities.for(player2)).toEqual(1);
      expect(player1.behavior.affinities.for(player3)).toEqual(-1);
      expect(player1.behavior.affinities.for(player4)).toEqual(-1);
      expect(player3.behavior.affinities.for(player1)).toEqual(0);
      expect(player3.behavior.affinities.for(player2)).toEqual(-1);
      expect(player3.behavior.affinities.for(player4)).toEqual(0);
      expect(player4.behavior.affinities.for(player1)).toEqual(0);
      expect(player4.behavior.affinities.for(player2)).toEqual(-1);
      expect(player4.behavior.affinities.for(player3)).toEqual(0);
    });

    test("Queen of clubs played twice - everybody knows now", async () => {
      player1.hand = new Hand([queen.of(Suit.Clubs).first()]);
      player2.hand = new Hand([queen.of(Suit.Clubs).second()]);
      await player1.play(player1.hand.highest());
      await player2.play(player2.hand.highest());
      expect(player2.behavior.affinities.for(player1)).toEqual(1);
      expect(player2.behavior.affinities.for(player3)).toEqual(-1);
      expect(player2.behavior.affinities.for(player4)).toEqual(-1);
      expect(player3.behavior.affinities.for(player1)).toEqual(-1);
      expect(player3.behavior.affinities.for(player2)).toEqual(-1);
      expect(player3.behavior.affinities.for(player4)).toEqual(1);
      expect(player4.behavior.affinities.for(player1)).toEqual(-1);
      expect(player4.behavior.affinities.for(player3)).toEqual(1);
      expect(player4.behavior.affinities.for(player2)).toEqual(-1);
    });

    test("Re announces, Queen Of Clubs played", async () => {
      player2.announce(Announcement.Re);
      player1.hand = new Hand([queen.of(Suit.Clubs).first()]);
      await player1.play(player1.hand.highest());
      expect(player1.behavior.affinities.for(player2)).toEqual(1);
      expect(player1.behavior.affinities.for(player3)).toEqual(-1);
      expect(player1.behavior.affinities.for(player4)).toEqual(-1);
      expect(player3.behavior.affinities.for(player1)).toEqual(-1);
      expect(player3.behavior.affinities.for(player2)).toEqual(-1);
      expect(player3.behavior.affinities.for(player4)).toEqual(1);
      expect(player4.behavior.affinities.for(player1)).toEqual(-1);
      expect(player4.behavior.affinities.for(player2)).toEqual(-1);
      expect(player4.behavior.affinities.for(player3)).toEqual(1);
    });
  });

  describe("Silent Wedding - 1 vs. 2,3,4", () => {
    const reParty = new PartyBuilder(PartyName.Re)
      .withPlayer(new Player("One"))
      .build();
    const kontraParty = new PartyBuilder(PartyName.Kontra)
      .withPlayer(new Player("Two"))
      .withPlayer(new Player("Three"))
      .withPlayer(new Player("Four"))
      .build();
    const player1 = reParty.players[0];
    const player2 = kontraParty.players[0];
    const player3 = kontraParty.players[1];
    const player4 = kontraParty.players[2];
    const players = [player1, player2, player3, player4];
    let game = new Game(players);

    beforeEach(() => {
      jest.clearAllMocks();
      game = new Game(players);
      player1.reset();
      player2.reset();
      player3.reset();
      player4.reset();
      player1.behavior.affinities.setPlayers(players);
      player2.behavior.affinities.setPlayers(players);
      player3.behavior.affinities.setPlayers(players);
      player4.behavior.affinities.setPlayers(players);
      player2.possibleAnnouncements = jest
        .fn()
        .mockReturnValue(new Set([Announcement.Re]));
      player3.possibleAnnouncements = jest
        .fn()
        .mockReturnValue(new Set([Announcement.Kontra]));
    });

    test("Queen of clubs played once - nobody knows about the silent wedding", async () => {
      player1.hand = new Hand([queen.of(Suit.Clubs).second()]);
      await player1.play(player1.hand.highest());
      expect(player2.behavior.affinities.for(player1)).toEqual(-1);
      expect(player2.behavior.affinities.for(player3)).toEqual(0);
      expect(player2.behavior.affinities.for(player4)).toEqual(0);
      expect(player3.behavior.affinities.for(player1)).toEqual(-1);
      expect(player3.behavior.affinities.for(player2)).toEqual(0);
      expect(player3.behavior.affinities.for(player4)).toEqual(0);
      expect(player4.behavior.affinities.for(player1)).toEqual(-1);
      expect(player4.behavior.affinities.for(player3)).toEqual(0);
      expect(player4.behavior.affinities.for(player2)).toEqual(0);
    });

    test("Queen of clubs played twice - everybody knows now", async () => {
      player2.behavior.affinities.hasPlayedQueenOfClubs = jest
        .fn()
        .mockReturnValue(true);
      player3.behavior.affinities.hasPlayedQueenOfClubs = jest
        .fn()
        .mockReturnValue(true);
      player4.behavior.affinities.hasPlayedQueenOfClubs = jest
        .fn()
        .mockReturnValue(true);
      player1.hand = new Hand([queen.of(Suit.Clubs).second()]);
      await player1.play(player1.hand.highest());
      expect(player2.behavior.affinities.for(player1)).toEqual(-1);
      expect(player2.behavior.affinities.for(player3)).toEqual(1);
      expect(player2.behavior.affinities.for(player4)).toEqual(1);
      expect(player3.behavior.affinities.for(player1)).toEqual(-1);
      expect(player3.behavior.affinities.for(player2)).toEqual(1);
      expect(player3.behavior.affinities.for(player4)).toEqual(1);
      expect(player4.behavior.affinities.for(player1)).toEqual(-1);
      expect(player4.behavior.affinities.for(player3)).toEqual(1);
      expect(player4.behavior.affinities.for(player2)).toEqual(1);
    });
  });
});
