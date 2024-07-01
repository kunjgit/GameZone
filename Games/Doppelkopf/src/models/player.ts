import { v4 as uuidv4 } from "uuid";
import { Hand } from "@/models/hand";
import { TrickStack } from "@/models/trickStack";
import { Behavior, RuleBasedBehaviour } from "@/models/behaviors";
import { notifier } from "./notifier";
import { options } from "./options";
import { Announcement, getAnnouncementOrder } from "./announcements";
import { playableCards } from "./playableCardFinder";
import { Memory, PerfectMemory } from "./memory";
import { Card } from "./card";
import { Trick } from "./trick";
import { Game } from "./game";
import { TablePosition } from "./tablePosition";
import { Affinities, AffinityEvent } from "@/models/affinities";
import { allCards } from "./deck";
import { findParties, Party, PartyName } from "./party";
import { Reservation } from "./reservations";

// TODO: break circular dependency between player & game, make game non-null
export class Player {
  id: string = uuidv4();
  name: string;
  hand: Hand;
  trickStack: TrickStack = new TrickStack();
  announcements: Set<Announcement> = new Set();
  isHuman: boolean;
  isMe: boolean;
  tablePosition: string;
  game?: Game;
  behavior: Behavior;
  memory: Memory;
  reservation: Reservation;

  constructor(
    name: string,
    isHuman = false,
    isMe = false,
    tablePosition = TablePosition.Bottom,
    game?: Game,
    behaviour = RuleBasedBehaviour,
    memory = new PerfectMemory()
  ) {
    this.name = name;
    this.hand = new Hand();
    this.isHuman = isHuman;
    this.isMe = isMe;
    this.tablePosition = tablePosition;
    this.game = game;
    this.behavior = new behaviour(this.id, new Affinities(this));
    this.memory = memory;
    this.reservation = Reservation.None;

    this.reset();
  }

  isRe() {
    return this.hand.isRe();
  }

  isKontra() {
    return !this.isRe();
  }

  getParty(): Party {
    const partyName = this.isRe() ? PartyName.Re : PartyName.Kontra;
    return findParties(this.game!.players)[partyName];
  }

  async autoplay() {
    const cardToBePlayed = this.behavior.cardToPlay(
      this.hand,
      this.game?.currentTrick!,
      this.memory
    );

    if (cardToBePlayed) {
      await this.play(cardToBePlayed);
    }

    const announcement = this.behavior.announcementToMake(
      this.possibleAnnouncements(),
      this.hand
    );
    if (announcement !== null) {
      this.announce(announcement);
    }
  }

  async play(card: Card) {
    if (!card || !this.hand.find(card)) {
      throw new Error("can't play a card that's not on the player's hand");
    }
    if (
      this.game?.currentTrick.isFinished &&
      this.game?.currentTrick.winner() === this
    ) {
      await this.game?.currentRound.finishTrick();
      await this.playAction(card);
      return;
    }
    if (!this.canPlay(card)) {
      notifier.info("cant-play-card");
      return;
    }
    if (this.game?.currentRound.waitingForPlayer() !== this) {
      notifier.info("not-your-turn");
      return;
    }

    await this.playAction(card);
  }

  private async playAction(card: Card) {
    try {
      this.game?.currentTrick.add(card, this);
      this.hand.remove(card);

      this.game?.currentRound.nextPlayer();

      if (options.autoplay === true) {
        await new Promise((r) => setTimeout(r, 800)); // timeout to accommodate for animation duration when playing a card
        await this.game?.currentRound.nextMove();
      }
    } catch (error) {
      if (this.isHuman) {
        notifier.info("not-your-turn");
        return;
      }
    }
  }

  numberOfCardsLeft() {
    return this.hand.cards.length;
  }

  canPlay(card: Card): boolean {
    const baseCard = this.game?.currentTrick.baseCard();
    const playable = playableCards(this.hand.cards, baseCard);
    return playable.includes(card);
  }

  win(trick: Trick) {
    this.trickStack.add(trick);
  }

  reset() {
    this.trickStack = new TrickStack();
    this.announcements = new Set();
    this.memory.clearMemory();
    this.behavior.reset();
    this.reservation = Reservation.None;
  }

  points() {
    return this.trickStack.points();
  }

  declareReservation(reservation: Reservation) {
    this.reservation = reservation;
  }

  promptForReservation() {
    if (this.isHuman && this.reservation === Reservation.None) {
      throw new Error("human player didn't declare a reservation");
    }

    if (this.reservation === Reservation.None) {
      this.declareReservation(this.behavior.reservationToDeclare());
    }

    return this.reservation;
  }

  announce(announcement: Announcement) {
    if (![...this.possibleAnnouncements()].includes(announcement)) {
      throw new Error("Invalid announcement");
    }

    this.game?.players.forEach((p) => {
      p.behavior.handleAffinityEvent(AffinityEvent.Announcement, this);
    });

    const announcementOrder = getAnnouncementOrder(this.isRe());
    const pos = announcementOrder.findIndex((a) => a === announcement);
    this.announcements = new Set(announcementOrder.slice(0, pos + 1));

    notifier.info("player-announced-" + announcement, { name: this.name });
  }

  hasPartyAnnounced(...announcements: Announcement[]): boolean {
    return announcements.every((a) =>
      [...this.getPartyAnnouncements()].includes(a)
    );
  }

  private getPartyAnnouncements(): Set<Announcement> {
    return new Set<Announcement>(this.getParty().announcements());
  }

  possibleAnnouncements(): Set<Announcement> {
    const diff = Math.max(
      0,
      this.getStartingCards() - this.numberOfCardsLeft() - 1
    );
    const announcements = getAnnouncementOrder(this.isRe());
    const cardBasedAllowedAnnouncements = announcements.slice(0, diff);
    const leftOverAnnouncements = announcements.slice(diff);
    return this.hasPartyAnnounced(...cardBasedAllowedAnnouncements)
      ? new Set<Announcement>(
          leftOverAnnouncements.filter(
            (a) => ![...this.getPartyAnnouncements()].includes(a)
          )
        )
      : new Set<Announcement>();
  }

  // ToDo use better way to find out if game sharp doko
  private getStartingCards(): number {
    return allCards.length / this.game?.players.length!;
  }
}
