import { Trick } from "@/models/trick";
import { PartyName, Party } from "@/models/party";
import { extras } from "@/models/extras";
import { Announcement } from "@/models/announcements";
import { Game } from "@/models/game";
import { PlayerBuilder } from "../../builders/playerBuilder";

const game = Game.singlePlayer();

const player1 = game.players[0];
const player2 = game.players[1];
const player3 = game.players[2];
const player4 = game.players[3];

test("should aggregate points", () => {
  player1.points = () => 10;
  player2.points = () => 20;
  const party = new Party(PartyName.Re, player1, player2);
  expect(party.points()).toEqual(30);
});

test("should aggregate announcements", () => {
  player1.numberOfCardsLeft = () => 10;
  player1.isRe = () => false;
  player1.announce(Announcement.Kontra);
  player1.announce(Announcement.No90);

  const party = new Party(PartyName.Kontra, player1, player2);

  expect(party.announcements()).toEqual([
    Announcement.Kontra,
    Announcement.No90,
  ]);
});

test("should aggregate extras", () => {
  const doppelkopfTrick = new Trick([player1, player2, player3, player4]);
  doppelkopfTrick.extras = () => [extras.doppelkopf];
  doppelkopfTrick.isFinished = () => true;

  const foxTrick = new Trick([player1, player2, player3, player4]);
  foxTrick.extras = () => [extras.fox];
  foxTrick.isFinished = () => true;

  player1.win(doppelkopfTrick);
  player2.win(foxTrick);

  const party = new Party(PartyName.Kontra, player1, player2);
  expect(party.extras()).toEqual([extras.doppelkopf, extras.fox]);
});

test("should return player names as string", () => {
  const one = new PlayerBuilder("One").build();
  const two = new PlayerBuilder("Two").build();
  const three = new PlayerBuilder("Three").build();
  const party = new Party(PartyName.Re, one, two, three);

  const partyMembers = party.playerNames();

  expect(partyMembers).toEqual("One & Two & Three");
});
