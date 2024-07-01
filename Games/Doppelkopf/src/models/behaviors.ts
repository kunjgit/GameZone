import { sample } from "@/models/random";
import { playableCards } from "@/models/playableCardFinder";
import {
  Card,
  Suit,
  Rank,
  byCardValuesDesc,
  ten,
  ace,
  queen,
} from "@/models/card";
import { Hand } from "@/models/hand";
import { Announcement } from "./announcements";
import { Trick } from "./trick";
import { Memory } from "./memory";
import { Player } from "./player";
import { Affinities, AffinityEvent } from "./affinities";
import {
  chanceAnnouncement,
  conservativeAnnouncement,
} from "@/models/announcementRules";
import { Reservation } from "./reservations";

export abstract class Behavior {
  constructor(public playerId: string, public affinities: Affinities) {}

  reset() {
    this.affinities.reset();
  }

  reservationToDeclare(): Reservation {
    return Reservation.Healthy;
  }

  abstract cardToPlay(hand: Hand, trick: Trick, memory?: Memory): Card;

  abstract handleAffinityEvent(event: AffinityEvent, player: Player): void;

  abstract announcementToMake(
    possibleAnnouncements: Set<Announcement>,
    hand?: Hand
  ): Announcement | null;
}

export class HighestCardBehavior extends Behavior {
  handleAffinityEvent(event: AffinityEvent, player: Player): void {}

  cardToPlay(hand: Hand, trick: Trick, memory?: Memory) {
    return playableCards(hand.cards, trick.baseCard())[0];
  }

  announcementToMake(
    possibleAnnouncements: Set<Announcement>,
    hand?: Hand
  ): Announcement | null {
    return null;
  }
}
export class RandomCardBehavior extends Behavior {
  handleAffinityEvent(event: AffinityEvent, player: Player): void {}

  cardToPlay(hand: Hand, trick: Trick, memory?: Memory) {
    return sample(playableCards(hand.cards, trick.baseCard()))!;
  }

  announcementToMake(
    possibleAnnouncements: Set<Announcement>,
    hand?: Hand
  ): Announcement | null {
    const decision = new chanceAnnouncement(0.1);
    return decision.announcementToMake(possibleAnnouncements, hand);
  }
}

export class RuleBasedBehaviour extends Behavior {
  handleAffinityEvent(event: AffinityEvent, player: Player): void {
    switch (event) {
      case AffinityEvent.Announcement:
        this.affinities.declaresParty(player);
        break;
      case AffinityEvent.QueenOfClubs:
        this.affinities.declaresParty(player, true);
        break;
      case AffinityEvent.QueenOfClubsTricked:
        this.affinities.suggestKontraFor(player);
        break;
      case AffinityEvent.QueenOfClubsNotGreased:
        this.affinities.suggestKontraFor(player);
        break;
      case AffinityEvent.QueenOfClubsGreased:
        this.affinities.suggestReFor(player);
        break;
      default:
        break;
    }
  }

  announcementToMake(
    possibleAnnouncements: Set<Announcement>,
    hand: Hand
  ): Announcement | null {
    const decision = new conservativeAnnouncement();
    return decision.announcementToMake(possibleAnnouncements, hand);
  }

  cardToPlay(hand: Hand, trick: Trick, memory?: Memory): Card {
    let baseCard = trick.baseCard();
    // Teammate will win trick no matter what
    if (this.teammateWinsTrick(trick, hand, memory))
      return this.findMostSuitableGreasingCard(hand, trick);

    if (trick.cards().length == 3) {
      return this.playPosition(hand, trick);
    }

    // You're not able to win the trick on your own no matter what
    if (this.trickCannotBeWon(hand, trick, memory))
      return this.findLeastValuableLosingCard(hand, trick);

    /** It's our turn. Decide how to deal with cards */
    if (!baseCard) return this.startingRule(hand, trick, memory);
    if (!baseCard.isTrump()) return this.nonTrumpRule(hand, trick, memory);
    if (trick.contains(ace.of(Suit.Diamonds))) return hand.highest();
    if (
      baseCard.isTrump() &&
      this.isTeammateAfterMe(trick) &&
      trick.cards().length === 2 &&
      this.hasHighValueTrump(hand) &&
      queen.of(Suit.Hearts).beats(trick.highestCard()!.card)
    )
      return this.findMostSuitableGreasingCard(hand, trick);
    // ToDo how to play if not starting or mustn't serve nonTrump
    // i'm thinking of something working with expectation value
    return this.defaultPlay(hand, trick);
  }

  defaultPlay(hand: Hand, trick: Trick): Card {
    return this.findMostSuitableBeatingCard(hand, trick);
  }

  startingRule(hand: Hand, trick: Trick, memory?: Memory): Card {
    for (const ace of hand.getBlankAces()) {
      if (!memory?.hasSuitBeenPlayedBefore(ace.suit)) {
        return ace;
      }
    }
    for (const suit of [Suit.Clubs, Suit.Spades, Suit.Hearts]) {
      if (
        hand.findAny(suit, Rank.Ace) &&
        !memory?.hasSuitBeenPlayedBefore(suit) &&
        hand.nonTrumps(suit).length <= 3
      ) {
        return hand.nonTrumps(suit)[0];
      }
    }

    /**
     * Play Suit that has been thrown by teammate
     */
    for (const suit of [Suit.Clubs, Suit.Spades, Suit.Hearts]) {
      if (hand.nonTrumps(suit)[0]) {
        let teammateThrew = false;
        let enemiesThrew = false;
        // is there a teammate who has thrown
        for (let teammate of this.getTeammates()) {
          if (memory?.hasSuitBeenThrownByPlayer(suit, teammate)) {
            teammateThrew = true;
          }
        }
        // is there an enemy who has thrown
        for (let enemy of this.getEnemies()) {
          if (memory?.hasSuitBeenThrownByPlayer(suit, enemy)) {
            enemiesThrew = true;
          }
        }
        if (teammateThrew && !enemiesThrew) {
          return hand.nonTrumps(suit)[0];
        }
      }
    }

    // ToDo check if we know with whom we play and if we want to play a strategy
    if (this.getMyPlayer(trick).isKontra()) {
      return this.findLeastValuableLosingCard(hand, trick);
    }

    return (
      hand
        .lowValues()
        .filter((card) => card.isTrump())
        .reverse()[0] ?? this.findLeastValuableLosingCard(hand, trick)
    );
  }

  nonTrumpRule(hand: Hand, trick: Trick, memory?: Memory): Card {
    let baseCard = trick.baseCard()!;
    if (hand.nonTrumps(baseCard.suit).length) {
      return this.serveNonTrump(hand, trick, memory);
    }

    if (memory?.hasSuitBeenPlayedBefore(baseCard.suit, trick.id!)) {
      return hand.highest().beats(trick.highestCard()!.card) &&
        // ToDo this check works but needs tuning
        memory.pointsLeftInSuit(baseCard.suit) + trick.points() >= 14
        ? hand.highest()
        : this.findMostSuitableBeatingCard(hand, trick);
    }

    return (
      this.findMostValuableWinningTrump(hand, trick) ??
      this.findLeastValuableLosingCard(hand, trick)
    );
  }

  playPosition(hand: Hand, trick: Trick): Card {
    if (this.isTeammateKnown() && this.isCurrentWinnerTeammate(trick)) {
      return this.findMostSuitableGreasingCard(hand, trick);
    }
    let winningTrump = this.findMostValuableWinningTrump(
      new Hand(playableCards(hand.cards, trick.baseCard()!)),
      trick
    );
    if (winningTrump) {
      if (trick.points() >= 14 || winningTrump.value <= 3) {
        return winningTrump;
      }
    }
    return this.findLeastValuableLosingCard(hand, trick);
  }

  teammateWinsTrick(trick: Trick, hand: Hand, memory?: Memory): Boolean {
    return (
      this.isTeammateKnown() &&
      this.isCurrentWinnerTeammate(trick) &&
      !!memory?.isHighestCardLeft(trick.highestCard()!.card, hand)
    );
  }

  trickCannotBeWon(hand: Hand, trick: Trick, memory?: Memory): Boolean {
    return (
      !!trick.baseCard()?.isTrump() &&
      (!hand.highest().beats(trick.highestCard()!.card) ||
        !!memory?.isHighestCardLeft(trick.highestCard()!.card))
    );
  }

  private isTeammateKnown(): Boolean {
    return (
      this.affinities.affinityTable.filter(
        (playerAffinity) => playerAffinity.affinity === 1
      ).length > 0
    );
  }

  private getTeammates(): Player[] {
    return this.affinities.affinityTable
      .filter((playerAffinity) => playerAffinity.affinity === 1)
      .map((playerAffinity) => playerAffinity.player);
  }

  private getEnemies(): Player[] {
    return this.affinities.affinityTable
      .filter((playerAffinity) => playerAffinity.affinity === -1)
      .map((playerAffinity) => playerAffinity.player);
  }

  private isCurrentWinnerTeammate(trick: Trick): Boolean {
    return (
      trick.highestCard()?.player.isRe() === this.getMyPlayer(trick)?.isRe()
    );
  }

  private isTeammateAfterMe(trick: Trick): Boolean {
    const playersPlayed = trick.playedCards.map(
      (playedCard) => playedCard.player
    );
    return (
      this.getTeammates().filter((mate) => !playersPlayed.includes(mate))
        .length > 0
    );
  }

  private hasHighValueTrump(hand: Hand): Boolean {
    return (
      hand.contains(ace.of(Suit.Diamonds)) ||
      hand.contains(ten.of(Suit.Diamonds))
    );
  }

  private getMyPlayer(trick: Trick): Player {
    return trick.players.find((player) => player.id === this.playerId)!;
  }

  serveNonTrump(hand: Hand, trick: Trick, memory?: Memory): Card {
    let nonTrumpCards = hand.nonTrumps(trick.baseCard()!.suit);
    let highest = nonTrumpCards[0];
    let lowest = nonTrumpCards.slice(-1)[0];

    if (memory?.hasSuitBeenPlayedBefore(trick.baseCard()!.suit, trick.id)) {
      return lowest;
    }

    if (
      highest.beats(trick.highestCard()!.card) &&
      highest.rank === Rank.Ace &&
      // TODO trick.expectedNumberOfCards needs to change as soon as 9er game is possible
      nonTrumpCards.length < trick.players.length
    ) {
      return highest;
    }

    return lowest;
  }

  findMostSuitableBeatingCard(hand: Hand, trick: Trick): Card {
    const beats = playableCards(
      [
        ...hand.cards
          .filter(
            (card) =>
              card.isTrump() &&
              card.beats(trick.highestCard()?.card) &&
              card.value < 10
          )
          .reverse(),
      ],
      trick.baseCard()
    );
    return beats.length > 0
      ? beats[0]
      : this.findLeastValuableLosingCard(hand, trick);
  }

  /**
   * Find a card on a given hand that will add as much value as suitable.
   * Will prefer non-trumps over trumps.
   * Fox is most important though.
   * Will only grease with ten of hearts if only possibility
   * @param {Hand} hand - The hand to find the card on
   * @param {Trick} trick - The trick that should be greased
   * @returns {Card} - The most suitable greasing card that can be found
   */
  findMostSuitableGreasingCard(hand: Hand, trick?: Trick): Card {
    const fox = hand.findAny(Suit.Diamonds, Rank.Ace);
    const tenOfHearts = hand.findAny(Suit.Hearts, Rank.Ten);
    const queens = hand.cards
      .filter((card) => card.rank == Rank.Queen)
      .reverse();

    const cardPreference = [
      fox!,
      ...hand.cards
        .sort(byCardValuesDesc)
        .filter(
          (card) => !card.is(ten.of(Suit.Hearts)) && card.rank != Rank.Queen
        ),
      ...queens,
      tenOfHearts!,
    ].filter(Boolean);

    return playableCards(cardPreference, trick?.baseCard())[0];
  }

  /**
   * Find a trump on a given hand that will win the given trick at this point in time.
   * Will prefer high-value trumps (ace of diamonds, ten of diamonds) if possible.
   * Otherwise it will fall back to the lowest trump possible.
   * @param {Hand} hand - The hand to find the trump on
   * @param {Trick} trick - The trick that should be trumped
   * @returns {Card} - The most valuable trump card or null if no winning trump can be found
   */
  findMostValuableWinningTrump(hand: Hand, trick: Trick): Card | null {
    const highestCard = trick.highestCard()!.card;

    const aceOfDiamonds = hand.findAny(Suit.Diamonds, Rank.Ace);
    const tenOfDiamonds = hand.findAny(Suit.Diamonds, Rank.Ten);

    const trumpPreference = [
      aceOfDiamonds,
      tenOfDiamonds,
      ...hand.trumps().reverse(),
    ];
    return (
      trumpPreference.find((card) => card && card.beats(highestCard)) ?? null
    );
  }

  /**
   * Find a card on a given hand that will add as less value as possible.
   * Will prefer jacks before tens and aces.
   * @param {Hand} hand - The hand to find the trump on
   * @param {Trick} trick - The trick that should be trumped
   * @returns {Card} - The least valuable card that can be found
   */
  findLeastValuableLosingCard(hand: Hand, trick: Trick): Card {
    const cardPreference = [
      ...hand.nonTrumps().filter((card) => card.value === 4),
      ...hand
        .lowValues()
        .filter((card) => card.value !== 3)
        .reverse(),
      ...hand.cards.reverse(),
    ];
    return playableCards(cardPreference, trick.baseCard())[0];
  }
}
