import { Announcement } from "@/models/announcements";
import { Hand } from "@/models/hand";
import { Rank, Suit, ten } from "@/models/card";
import { chance } from "@/models/random";

export interface announcementRules {
  announcementToMake(
    possibleAnnouncements: Set<Announcement>,
    hand?: Hand
  ): Announcement | null;
}

export class chanceAnnouncement implements announcementRules {
  announcementChance: number;

  constructor(chance: number) {
    this.announcementChance = chance;
  }

  announcementToMake(
    possibleAnnouncements: Set<Announcement>,
    hand?: Hand
  ): Announcement | null {
    if (possibleAnnouncements.size === 0) {
      return null;
    }

    if (chance(this.announcementChance)) {
      return [...possibleAnnouncements][0];
    }

    return null;
  }
}

export class goodyAnnouncement implements announcementRules {
  announcementToMake(
    possibleAnnouncements: Set<Announcement>,
    hand: Hand
  ): Announcement | null {
    if (
      [...possibleAnnouncements].includes(Announcement.Kontra) ||
      [...possibleAnnouncements].includes(Announcement.Re)
    ) {
      let counter = 0;
      if (hand.getBlankAces().length > 0) counter++;
      if (hand.trumps().length >= 7) counter++;
      if (hand.cards.filter((c) => c.is(ten.of(Suit.Hearts))).length === 2)
        counter++;
      counter += hand.getMissingSuites().length;
      return counter > 2 ? [...possibleAnnouncements][0] : null;
    }
    return null;
  }
}

export class conservativeAnnouncement implements announcementRules {
  announcementToMake(
    possibleAnnouncements: Set<Announcement>,
    hand: Hand
  ): Announcement | null {
    if (
      [...possibleAnnouncements].includes(Announcement.Kontra) ||
      [...possibleAnnouncements].includes(Announcement.Re)
    ) {
      if (
        hand.trumps().length >= 9 ||
        (hand.trumps().length >= 8 && hand.getMissingSuites().length >= 1) ||
        (hand.trumps().length >= 8 &&
          hand.contains(ten.of(Suit.Hearts)) &&
          hand.cards.filter((c) => c.rank === Rank.Queen).length >= 3)
        // TODO add to clause: starts next trick (aufspiel)
        //|| (hand.trumps().length >= 7 && hand.getBlankAces().length >= 1)
      ) {
        return [...possibleAnnouncements][0];
      }
    }
    return null;
  }
}
