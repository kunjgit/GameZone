import { Announcement } from "@/models/announcements";
import { Extra, extras } from "@/models/extras";
import { Party, PartyName } from "./party";

export class Score {
  parties: { [name: string]: Party };

  constructor(reParty: Party, kontraParty: Party) {
    this.parties = {};
    this.parties[PartyName.Re] = reParty;
    this.parties[PartyName.Kontra] = kontraParty;

    const rePoints = this.parties[PartyName.Re].points();
    const kontraPoints = this.parties[PartyName.Kontra].points();
    if (rePoints + kontraPoints !== 240) {
      throw Error(
        `A score must have a total of 240 points. Got ${rePoints} for Re, ${kontraPoints} for Kontra`
      );
    }
  }

  winningPartyName(): PartyName | null {
    const reAnnouncements = this.parties[PartyName.Re].announcements();
    const kontraAnnouncements = this.parties[PartyName.Kontra].announcements();

    let reWinningThreshold = 121;
    let kontraWinningThreshold = 120;

    if (
      kontraAnnouncements.includes(Announcement.Kontra) &&
      !reAnnouncements.includes(Announcement.Re)
    ) {
      reWinningThreshold = 120;
      kontraWinningThreshold = 121;
    }

    if (reAnnouncements.includes(Announcement.No90)) {
      reWinningThreshold = 151;
      kontraWinningThreshold =
        kontraAnnouncements.length > 0 ? kontraWinningThreshold : 90;
    }

    if (reAnnouncements.includes(Announcement.No60)) {
      reWinningThreshold = 181;
      kontraWinningThreshold =
        kontraAnnouncements.length > 0 ? kontraWinningThreshold : 60;
    }

    if (reAnnouncements.includes(Announcement.No30)) {
      reWinningThreshold = 211;
      kontraWinningThreshold =
        kontraAnnouncements.length > 0 ? kontraWinningThreshold : 30;
    }

    if (reAnnouncements.includes(Announcement.NoPoints)) {
      reWinningThreshold = 240;
      kontraWinningThreshold =
        kontraAnnouncements.length > 0 ? kontraWinningThreshold : 1;
    }

    if (kontraAnnouncements.includes(Announcement.No90)) {
      kontraWinningThreshold = 151;
      reWinningThreshold = reAnnouncements.length > 0 ? reWinningThreshold : 90;
    }

    if (kontraAnnouncements.includes(Announcement.No60)) {
      kontraWinningThreshold = 181;
      reWinningThreshold = reAnnouncements.length > 0 ? reWinningThreshold : 60;
    }

    if (kontraAnnouncements.includes(Announcement.No30)) {
      kontraWinningThreshold = 211;
      reWinningThreshold = reAnnouncements.length > 0 ? reWinningThreshold : 30;
    }

    if (kontraAnnouncements.includes(Announcement.NoPoints)) {
      kontraWinningThreshold = 240;
      reWinningThreshold = reAnnouncements.length > 0 ? reWinningThreshold : 1;
    }

    if (this.parties[PartyName.Re].points() >= reWinningThreshold) {
      return PartyName.Re;
    }

    if (this.parties[PartyName.Kontra].points() >= kontraWinningThreshold) {
      return PartyName.Kontra;
    }

    return null;
  }

  losingPartyName() {
    if (this.winningPartyName() === null) {
      return null;
    }

    return this.winningPartyName() === PartyName.Re
      ? PartyName.Kontra
      : PartyName.Re;
  }

  winner() {
    let winningParty = this.winningPartyName();
    if (winningParty) {
      return this.parties[winningParty];
    }

    return undefined;
  }

  trickPoints(partyName: PartyName) {
    return this.parties[partyName].points();
  }

  points(partyName: PartyName) {
    const sumPoints = (accumulator: number, extra: Extra) =>
      accumulator + extra.points;
    return [...this.listExtras(partyName)].reduce(sumPoints, 0);
  }

  totalPoints(partyName: PartyName) {
    const otherPartyName =
      partyName === PartyName.Re ? PartyName.Kontra : PartyName.Re;
    const thisParty = this.parties[partyName] || this.parties[PartyName.Re];

    const delta = this.points(partyName) - this.points(otherPartyName);

    if (thisParty.isPlayingSolo()) {
      return delta * 3;
    }

    return delta;
  }

  _hasAnyPartyAnnounced(announcement: Announcement) {
    return Object.values(this.parties).some((party) =>
      party.announcements().includes(announcement)
    );
  }

  listExtras(partyName: PartyName) {
    const allExtras = [];
    const partyPoints = this.parties[partyName].points();
    const partyAnnouncements = this.parties[partyName].announcements();
    const opponentAnnouncements =
      this.parties[
        partyName == PartyName.Re ? PartyName.Kontra : PartyName.Re
      ].announcements();

    if (partyName === this.winningPartyName()) {
      allExtras.push(extras.win);

      if (partyName === PartyName.Kontra) {
        allExtras.push(extras.beat_re);
      }

      if (this._hasAnyPartyAnnounced(Announcement.Re)) {
        allExtras.push(extras.announced_re);
      }

      if (this._hasAnyPartyAnnounced(Announcement.Kontra)) {
        allExtras.push(extras.announced_kontra);
      }

      if (partyPoints > 150) {
        allExtras.push(extras.no_90);
      }

      if (partyAnnouncements.includes(Announcement.No90)) {
        allExtras.push(extras.announced_no_90);
      }

      if (opponentAnnouncements.includes(Announcement.No90)) {
        allExtras.push(extras.opposing_party_announced_no_90);
      }

      if (
        partyPoints >= 120 &&
        opponentAnnouncements.includes(Announcement.No90)
      ) {
        allExtras.push(extras.got_120_against_no_90);
      }

      if (partyPoints > 180) {
        allExtras.push(extras.no_60);
      }

      if (partyAnnouncements.includes(Announcement.No60)) {
        allExtras.push(extras.announced_no_60);
      }

      if (opponentAnnouncements.includes(Announcement.No60)) {
        allExtras.push(extras.opposing_party_announced_no_60);
      }

      if (
        partyPoints >= 90 &&
        opponentAnnouncements.includes(Announcement.No60)
      ) {
        allExtras.push(extras.got_90_against_no_60);
      }

      if (partyPoints > 210) {
        allExtras.push(extras.no_30);
      }

      if (partyAnnouncements.includes(Announcement.No30)) {
        allExtras.push(extras.announced_no_30);
      }

      if (opponentAnnouncements.includes(Announcement.No30)) {
        allExtras.push(extras.opposing_party_announced_no_30);
      }

      if (
        partyPoints >= 60 &&
        opponentAnnouncements.includes(Announcement.No30)
      ) {
        allExtras.push(extras.got_60_against_no_30);
      }

      if (partyPoints === 240) {
        allExtras.push(extras.no_points);
      }

      if (partyAnnouncements.includes(Announcement.NoPoints)) {
        allExtras.push(extras.announced_no_points);
      }

      if (opponentAnnouncements.includes(Announcement.NoPoints)) {
        allExtras.push(extras.opposing_party_announced_no_points);
      }

      if (
        partyPoints >= 30 &&
        opponentAnnouncements.includes(Announcement.NoPoints)
      ) {
        allExtras.push(extras.got_30_against_no_points);
      }
    }

    const extrasFromTricks = this.parties[partyName].extras();
    if (extrasFromTricks.length > 0) {
      allExtras.push(...extrasFromTricks);
    }

    return allExtras;
  }
}
