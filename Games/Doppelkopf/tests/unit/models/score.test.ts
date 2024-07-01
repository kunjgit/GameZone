/* eslint-disable prettier/prettier */
import { Score } from "@/models/score";
import { PartyName } from "@/models/party";
import { Extra, extras } from "@/models/extras";
import { Announcement } from "@/models/announcements";
import { PartyBuilder } from "../../builders/partyBuilder";
import { PlayerBuilder } from "../../builders/playerBuilder";

describe("Score", () => {
  test("should throw error when evaluation not exactly 240 points", () => {
    const reParty = new PartyBuilder(PartyName.Re).withPoints(121).build();
    const kontraParty = new PartyBuilder(PartyName.Kontra)
      .withPoints(121)
      .build();

    const illegalScoreCall = () => new Score(reParty, kontraParty);

    expect(illegalScoreCall).toThrowError(
      "A score must have a total of 240 points. Got 121 for Re, 121 for Kontra"
    );
  });

  test("should distribute points evenly when playing regular game", () => {
    const reParty = new PartyBuilder(PartyName.Re)
      .withPlayer(new PlayerBuilder(`some re player`).build())
      .withPlayer(new PlayerBuilder(`another re player`).build())
      .withPoints(123)
      .build();

    const kontraParty = new PartyBuilder(PartyName.Kontra)
      .withPlayer(new PlayerBuilder(`some kontra player`).build())
      .withPlayer(new PlayerBuilder(`another kontra player`).build())
      .withPoints(240 - 123)
      .build();

    const score = new Score(reParty, kontraParty);

    expect(score.totalPoints(PartyName.Re)).toEqual(1);
    expect(score.totalPoints(PartyName.Kontra)).toEqual(-1);
  });

  test("should distribute points evenly when winning a solo", () => {
    const reParty = new PartyBuilder(PartyName.Re)
      .withPlayer(new PlayerBuilder(`some re player`).build())
      .withPoints(123)
      .build();

    const kontraParty = new PartyBuilder(PartyName.Kontra)
      .withPlayer(new PlayerBuilder(`1 kontra player`).build())
      .withPlayer(new PlayerBuilder(`2 kontra player`).build())
      .withPlayer(new PlayerBuilder(`3 kontra player`).build())
      .withPoints(117)
      .build();

    const score = new Score(reParty, kontraParty);

    expect(score.totalPoints(PartyName.Re)).toEqual(3);
    expect(score.totalPoints(PartyName.Kontra)).toEqual(-1);
  });

  test("should distribute points evenly when losing a solo", () => {
    const reParty = new PartyBuilder(PartyName.Re)
      .withPlayer(new PlayerBuilder(`some re player`).build())
      .withPoints(119)
      .build();

    const kontraParty = new PartyBuilder(PartyName.Kontra)
      .withPlayer(new PlayerBuilder(`1 kontra player`).build())
      .withPlayer(new PlayerBuilder(`2 kontra player`).build())
      .withPlayer(new PlayerBuilder(`3 kontra player`).build())
      .withPoints(121)
      .build();

    const score = new Score(reParty, kontraParty);

    expect(score.totalPoints(PartyName.Re)).toEqual(-6); // (win + against re) * 3
    expect(score.totalPoints(PartyName.Kontra)).toEqual(2);
  });
});

describe("Score valuation", () => {
  describe("re party", () => {
    test("should win with more than 120 points", () => {
      const reParty = new PartyBuilder(PartyName.Re).withPoints(121).build();
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withPoints(119)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.winningPartyName()).toBe(PartyName.Re);
      expect(score.losingPartyName()).toBe(PartyName.Kontra);
    });

    test("should win with 120 points if kontra party announced winning", () => {
      const reParty = new PartyBuilder(PartyName.Re).withPoints(120).build();
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withPoints(120)
        .withAnnouncement(Announcement.Kontra)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.winningPartyName()).toBe(PartyName.Re);
      expect(score.losingPartyName()).toBe(PartyName.Kontra);
    });

    test("should lose with 120 points if both parties announced winning", () => {
      const reParty = new PartyBuilder(PartyName.Re)
        .withPoints(120)
        .withAnnouncement(Announcement.Re)
        .build();
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withPoints(120)
        .withAnnouncement(Announcement.Kontra)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.winningPartyName()).toBe(PartyName.Kontra);
      expect(score.losingPartyName()).toBe(PartyName.Re);
    });

    test("should get 2 extra points for announcing 're'", () => {
      const reParty = new PartyBuilder(PartyName.Re)
        .withPoints(130)
        .withAnnouncement(Announcement.Re)
        .build();
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withPoints(110)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.winningPartyName()).toBe(PartyName.Re);
      expect(score.totalPoints(PartyName.Re)).toEqual(3); // 1 for winning, 2 for announcing
      expect([...score.listExtras(PartyName.Re)]).toEqual([
        extras.win,
        extras.announced_re,
      ]);
    });

    test("should get 2 points when kontra announced 'kontra'", () => {
      const reParty = new PartyBuilder(PartyName.Re).withPoints(140).build();
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withPoints(100)
        .withAnnouncement(Announcement.Kontra)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.winningPartyName()).toBe(PartyName.Re);
      expect(score.totalPoints(PartyName.Re)).toEqual(3); // 1 for winning, 2 for announcing
      expect([...score.listExtras(PartyName.Re)]).toEqual([
        extras.win,
        extras.announced_kontra,
      ]);
    });
  });

  describe("kontra party", () => {
    test("should win with 120 points or more", () => {
      const reParty = new PartyBuilder(PartyName.Re).withPoints(120).build();
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withPoints(120)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.winningPartyName()).toBe(PartyName.Kontra);
      expect(score.losingPartyName()).toBe(PartyName.Re);
    });

    test("should lose with 120 points when announcing 'kontra'", () => {
      const reParty = new PartyBuilder(PartyName.Re).withPoints(120).build();
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withPoints(120)
        .withAnnouncement(Announcement.Kontra)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.winningPartyName()).toBe(PartyName.Re);
      expect(score.losingPartyName()).toBe(PartyName.Kontra);
    });

    test("should get 1 extra point for winning against 're'", () => {
      const reParty = new PartyBuilder(PartyName.Re).withPoints(110).build();
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withPoints(130)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.totalPoints(PartyName.Kontra)).toBe(2);
      expect([...score.listExtras(PartyName.Re)]).toEqual([]);
      expect([...score.listExtras(PartyName.Kontra)]).toEqual([
        extras.win,
        extras.beat_re,
      ]);
    });

    test("should get 2 points for announcing 'kontra'", () => {
      const reParty = new PartyBuilder(PartyName.Re).withPoints(100).build();
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withPoints(140)
        .withAnnouncement(Announcement.Kontra)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.winningPartyName()).toBe(PartyName.Kontra);
      expect(score.totalPoints(PartyName.Kontra)).toEqual(4); // 1 for winning, 1 for beating re, 2 for announcing
      expect([...score.listExtras(PartyName.Kontra)]).toEqual([
        extras.win,
        extras.beat_re,
        extras.announced_kontra,
      ]);
    });

    test("should get 2 points when re announced 're'", () => {
      const reParty = new PartyBuilder(PartyName.Re)
        .withPoints(100)
        .withAnnouncement(Announcement.Re)
        .build();
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withPoints(140)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.winningPartyName()).toBe(PartyName.Kontra);
      expect(score.totalPoints(PartyName.Kontra)).toEqual(4); // 1 for winning, 1 for beating re, 2 for announcing
      expect([...score.listExtras(PartyName.Kontra)]).toEqual([
        extras.win,
        extras.beat_re,
        extras.announced_re,
      ]);
    });
  });

  describe("either party", () => {
    test("should get 1 point for winning", () => {
      const reParty = new PartyBuilder(PartyName.Re).withPoints(150).build();
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withPoints(90)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.totalPoints(PartyName.Re)).toBe(1);
      expect([...score.listExtras(PartyName.Re)]).toEqual([extras.win]);
      expect([...score.listExtras(PartyName.Kontra)]).toEqual([]);
    });

    const pointThresholds: Array<[number, Extra[]]> = [
      [151, [extras.win, extras.no_90]],
      [181, [extras.win, extras.no_90, extras.no_60]],
      [211, [extras.win, extras.no_90, extras.no_60, extras.no_30]],
      [
        240,
        [
          extras.win,
          extras.no_90,
          extras.no_60,
          extras.no_30,
          extras.no_points,
        ],
      ],
    ];

    test.each(pointThresholds)(
      "should get 1 extra point for getting %i points",
      (rePoints: number, expectedExtras: Extra[]) => {
        const reParty = new PartyBuilder(PartyName.Re)
          .withPoints(rePoints)
          .build();
        const kontraParty = new PartyBuilder(PartyName.Kontra)
          .withPoints(240 - rePoints)
          .build();

        const score = new Score(reParty, kontraParty);

        expect(score.totalPoints(PartyName.Re)).toBe(expectedExtras.length);
        expect([...score.listExtras(PartyName.Re)]).toEqual(expectedExtras);
        expect([...score.listExtras(PartyName.Kontra)]).toEqual([]);
      }
    );

    test("should get 1 point for announcing 'no 90' and getting more than 150 points", () => {
      const reParty = new PartyBuilder(PartyName.Re)
        .withAnnouncement(Announcement.Re)
        .withAnnouncement(Announcement.No90)
        .withPoints(151)
        .build();
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withPoints(240 - 151)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.totalPoints(PartyName.Re)).toBe(5);
      expect([...score.listExtras(PartyName.Re)]).toEqual([
        extras.win,
        extras.announced_re,
        extras.no_90,
        extras.announced_no_90,
      ]);
      expect([...score.listExtras(PartyName.Kontra)]).toEqual([]);
    });

    test("should get 1 point for announcing 'no 60' and getting more than 180 points", () => {
      const reParty = new PartyBuilder(PartyName.Re)
        .withPoints(240 - 181)
        .build();
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withAnnouncement(Announcement.Kontra)
        .withAnnouncement(Announcement.No90)
        .withAnnouncement(Announcement.No60)
        .withPoints(181)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.totalPoints(PartyName.Kontra)).toBe(8);
      expect([...score.listExtras(PartyName.Kontra)]).toEqual([
        extras.win,
        extras.beat_re,
        extras.announced_kontra,
        extras.no_90,
        extras.announced_no_90,
        extras.no_60,
        extras.announced_no_60,
      ]);
      expect([...score.listExtras(PartyName.Re)]).toEqual([]);
    });

    test("should get 1 point for announcing 'no 30' and getting more than 210 points", () => {
      const reParty = new PartyBuilder(PartyName.Re)
        .withAnnouncement(Announcement.Re)
        .withAnnouncement(Announcement.No90)
        .withAnnouncement(Announcement.No60)
        .withAnnouncement(Announcement.No30)
        .withPoints(211)
        .build();
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withPoints(240 - 211)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.totalPoints(PartyName.Re)).toBe(9);
      expect([...score.listExtras(PartyName.Re)]).toEqual([
        extras.win,
        extras.announced_re,
        extras.no_90,
        extras.announced_no_90,
        extras.no_60,
        extras.announced_no_60,
        extras.no_30,
        extras.announced_no_30,
      ]);
      expect([...score.listExtras(PartyName.Kontra)]).toEqual([]);
    });

    test("should get 1 point for announcing 'no points' and getting 240 points", () => {
      const reParty = new PartyBuilder(PartyName.Re)
        .withAnnouncement(Announcement.Re)
        .withAnnouncement(Announcement.No90)
        .withAnnouncement(Announcement.No60)
        .withAnnouncement(Announcement.No30)
        .withAnnouncement(Announcement.NoPoints)
        .withPoints(240)
        .build();
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withPoints(0)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.totalPoints(PartyName.Re)).toBe(11);
      expect([...score.listExtras(PartyName.Re)]).toEqual([
        extras.win,
        extras.announced_re,
        extras.no_90,
        extras.announced_no_90,
        extras.no_60,
        extras.announced_no_60,
        extras.no_30,
        extras.announced_no_30,
        extras.no_points,
        extras.announced_no_points,
      ]);
      expect([...score.listExtras(PartyName.Kontra)]).toEqual([]);
    });

    test("should lose with less than 151 points when announcing 'no 90'", () => {
      const reParty = new PartyBuilder(PartyName.Re)
        .withAnnouncement(Announcement.Re)
        .withAnnouncement(Announcement.No90)
        .withPoints(150)
        .build();
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withPoints(90)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.winningPartyName()).toBe(PartyName.Kontra);
      expect(score.totalPoints(PartyName.Kontra)).toBe(5); // all points go to winning party
      expect([...score.listExtras(PartyName.Kontra)]).toEqual([
        extras.win,
        extras.beat_re,
        extras.announced_re,
        extras.opposing_party_announced_no_90,
      ]);
      expect([...score.listExtras(PartyName.Re)]).toEqual([]);
    });

    test("should lose with less than 181 points when announcing 'no 60'", () => {
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withAnnouncement(Announcement.Kontra)
        .withAnnouncement(Announcement.No90)
        .withAnnouncement(Announcement.No60)
        .withPoints(180)
        .build();
      const reParty = new PartyBuilder(PartyName.Re).withPoints(60).build();

      const score = new Score(reParty, kontraParty);

      expect(score.winningPartyName()).toBe(PartyName.Re);
      expect(score.totalPoints(PartyName.Re)).toBe(5);
      expect([...score.listExtras(PartyName.Re)]).toEqual([
        extras.win,
        extras.announced_kontra,
        extras.opposing_party_announced_no_90,
        extras.opposing_party_announced_no_60,
      ]);
      expect([...score.listExtras(PartyName.Kontra)]).toEqual([]);
    });

    test("should lose with less than 211 points when announcing 'no 30'", () => {
      const reParty = new PartyBuilder(PartyName.Re)
        .withAnnouncement(Announcement.Re)
        .withAnnouncement(Announcement.No90)
        .withAnnouncement(Announcement.No60)
        .withAnnouncement(Announcement.No30)
        .withPoints(210)
        .build();
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withPoints(30)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.winningPartyName()).toBe(PartyName.Kontra);
      expect(score.totalPoints(PartyName.Kontra)).toBe(7);
      expect([...score.listExtras(PartyName.Kontra)]).toEqual([
        extras.win,
        extras.beat_re,
        extras.announced_re,
        extras.opposing_party_announced_no_90,
        extras.opposing_party_announced_no_60,
        extras.opposing_party_announced_no_30,
      ]);
      expect([...score.listExtras(PartyName.Re)]).toEqual([]);
    });

    test("should lose with less than 240 points when announcing 'no points'", () => {
      const reParty = new PartyBuilder(PartyName.Re)
        .withAnnouncement(Announcement.Re)
        .withAnnouncement(Announcement.No90)
        .withAnnouncement(Announcement.No60)
        .withAnnouncement(Announcement.No30)
        .withAnnouncement(Announcement.NoPoints)
        .withPoints(239)
        .build();
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withPoints(1)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.winningPartyName()).toBe(PartyName.Kontra);
      expect(score.totalPoints(PartyName.Kontra)).toBe(8);
      expect([...score.listExtras(PartyName.Kontra)]).toEqual([
        extras.win,
        extras.beat_re,
        extras.announced_re,
        extras.opposing_party_announced_no_90,
        extras.opposing_party_announced_no_60,
        extras.opposing_party_announced_no_30,
        extras.opposing_party_announced_no_points,
      ]);
      expect([...score.listExtras(PartyName.Re)]).toEqual([]);
    });

    test("should get 1 point when getting 120 points against a 'no 90' announcement", () => {
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withAnnouncement(Announcement.Kontra)
        .withAnnouncement(Announcement.No90)
        .withPoints(120)
        .build();
      const reParty = new PartyBuilder(PartyName.Re).withPoints(120).build();

      const score = new Score(reParty, kontraParty);

      expect(score.winningPartyName()).toBe(PartyName.Re);
      expect(score.totalPoints(PartyName.Re)).toBe(5);
      expect([...score.listExtras(PartyName.Re)]).toEqual([
        extras.win,
        extras.announced_kontra,
        extras.opposing_party_announced_no_90,
        extras.got_120_against_no_90,
      ]);
      expect([...score.listExtras(PartyName.Kontra)]).toEqual([]);
    });

    test("should get 1 point when getting 90 points against a 'no 60' announcement", () => {
      const reParty = new PartyBuilder(PartyName.Re)
        .withAnnouncement(Announcement.Re)
        .withAnnouncement(Announcement.No90)
        .withAnnouncement(Announcement.No60)
        .withPoints(150)
        .build();
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withPoints(90)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.winningPartyName()).toBe(PartyName.Kontra);
      expect(score.totalPoints(PartyName.Kontra)).toBe(7);
      expect([...score.listExtras(PartyName.Kontra)]).toEqual([
        extras.win,
        extras.beat_re,
        extras.announced_re,
        extras.opposing_party_announced_no_90,
        extras.opposing_party_announced_no_60,
        extras.got_90_against_no_60,
      ]);
      expect([...score.listExtras(PartyName.Re)]).toEqual([]);
    });

    test("should get 1 point when getting 60 points against a 'no 30' announcement", () => {
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withAnnouncement(Announcement.Kontra)
        .withAnnouncement(Announcement.No90)
        .withAnnouncement(Announcement.No60)
        .withAnnouncement(Announcement.No30)
        .withPoints(180)
        .build();
      const reParty = new PartyBuilder(PartyName.Re).withPoints(60).build();

      const score = new Score(reParty, kontraParty);

      expect(score.winningPartyName()).toBe(PartyName.Re);
      expect(score.totalPoints(PartyName.Re)).toBe(7);
      expect([...score.listExtras(PartyName.Re)]).toEqual([
        extras.win,
        extras.announced_kontra,
        extras.opposing_party_announced_no_90,
        extras.opposing_party_announced_no_60,
        extras.opposing_party_announced_no_30,
        extras.got_60_against_no_30,
      ]);
      expect([...score.listExtras(PartyName.Kontra)]).toEqual([]);
    });

    test("should get 1 point when getting 30 points against a 'no points' announcement", () => {
      const reParty = new PartyBuilder(PartyName.Re)
        .withAnnouncement(Announcement.Re)
        .withAnnouncement(Announcement.No90)
        .withAnnouncement(Announcement.No60)
        .withAnnouncement(Announcement.No30)
        .withAnnouncement(Announcement.NoPoints)
        .withPoints(210)
        .build();
      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withPoints(30)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.winningPartyName()).toBe(PartyName.Kontra);
      expect(score.totalPoints(PartyName.Kontra)).toBe(9);
      expect([...score.listExtras(PartyName.Kontra)]).toEqual([
        extras.win,
        extras.beat_re,
        extras.announced_re,
        extras.opposing_party_announced_no_90,
        extras.opposing_party_announced_no_60,
        extras.opposing_party_announced_no_30,
        extras.opposing_party_announced_no_points,
        extras.got_30_against_no_points,
      ]);
      expect([...score.listExtras(PartyName.Re)]).toEqual([]);
    });

    test("should get 1 point each for own and for losing party's announcements", () => {
      const reParty = new PartyBuilder(PartyName.Re)
        .withAnnouncement(Announcement.Re)
        .withAnnouncement(Announcement.No90)
        .withAnnouncement(Announcement.No60)
        .withPoints(59)
        .build();

      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withAnnouncement(Announcement.Kontra)
        .withAnnouncement(Announcement.No90)
        .withAnnouncement(Announcement.No60)
        .withPoints(181)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.winningPartyName()).toBe(PartyName.Kontra);
      expect(score.totalPoints(PartyName.Kontra)).toBe(14);
      expect([...score.listExtras(PartyName.Kontra)]).toEqual([
        extras.win,
        extras.beat_re,
        extras.announced_re,
        extras.announced_kontra,
        extras.no_90,
        extras.announced_no_90,
        extras.opposing_party_announced_no_90,
        extras.got_120_against_no_90,
        extras.no_60,
        extras.announced_no_60,
        extras.opposing_party_announced_no_60,
        extras.got_90_against_no_60,
      ]);
      expect([...score.listExtras(PartyName.Re)]).toEqual([]);
    });

    test("should lose both when neither reached their announced points", () => {
      /* how does this happen?
       * imagine "re" announces "no 90", and "kontra" announces "no 60"
       * now the game ends 110/130 - neither reached their announced goal
       * as a consequence there's no "winning" point, only trick-based extras
       */

      const reParty = new PartyBuilder(PartyName.Re)
        .withAnnouncement(Announcement.Re)
        .withAnnouncement(Announcement.No90)
        .withPoints(110)
        .build();

      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withAnnouncement(Announcement.Kontra)
        .withAnnouncement(Announcement.No90)
        .withAnnouncement(Announcement.No60)
        .withPoints(130)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.winningPartyName()).toBe(null);
      expect(score.totalPoints(PartyName.Re)).toBe(0);
      expect([...score.listExtras(PartyName.Kontra)]).toEqual([]);
      expect([...score.listExtras(PartyName.Re)]).toEqual([]);
    });

    test("should get 1 point for winning a 'Doppelkopf'", () => {
      const reParty = new PartyBuilder(PartyName.Re)
        .withPoints(110)
        .withExtra(extras.doppelkopf)
        .build();

      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withPoints(130)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.winningPartyName()).toBe(PartyName.Kontra);
      expect([...score.listExtras(PartyName.Re)]).toEqual([extras.doppelkopf]);
      expect([...score.listExtras(PartyName.Kontra)]).toEqual([
        extras.win,
        extras.beat_re,
      ]);
      expect(score.totalPoints(PartyName.Kontra)).toBe(1);
    });

    test("should get 1 point for catching a 'Fox'", () => {
      const reParty = new PartyBuilder(PartyName.Re).withPoints(130).build();

      const kontraParty = new PartyBuilder(PartyName.Kontra)
        .withPoints(110)
        .withExtra(extras.fox)
        .build();

      const score = new Score(reParty, kontraParty);

      expect(score.winningPartyName()).toBe(PartyName.Re);
      expect([...score.listExtras(PartyName.Kontra)]).toEqual([extras.fox]);
      expect([...score.listExtras(PartyName.Re)]).toEqual([extras.win]);
      expect(score.totalPoints(PartyName.Re)).toBe(0);
    });
  });
});
