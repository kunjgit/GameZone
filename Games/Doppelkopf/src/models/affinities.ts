import { Player } from "@/models/player";
import { getPartyName, PartyName } from "./party";

export enum AffinityEvent {
  Announcement = "announcement",
  QueenOfClubs = "queen_of_clubs",
  QueenOfClubsTricked = "queen_of_clubs_tricked",
  QueenOfClubsGreased = "queen_of_clubs_greased",
  QueenOfClubsNotGreased = "queen_of_clubs_not_greased",
}

/**
 * Represents the affinities for a single player for all other players\
 * in the game.
 *
 * Affinities express the relationship between players. Each player has
 * a certain affinity for each other player. Two players could be partners
 * if they are in the same party, or they could be opponents if they are in
 * different parties. If no player made any announcements or played a
 * queen of clubs yet, players won't know who's playing in the same party.
 * Some other events in the game could make a player believe that it's more likely
 * that other players play in the same party without knowing it for sure.
 *
 * All this information is captured in this Affinities class. An affinity between
 * two players ranges from
 * -1 (it's clear that they're playing in different parties), over
 *  0 (it's completely unknown if they're playing together or not) to
 * +1 (it's clear that they're playing in the same party)
 * and it can take any value in between to track suspected affinities
 * (e.g. if a player plays a high value card when a trick is goign to another player).
 *
 * The information which players are in the same party is asymmetric
 * - not all players share the same knowledge.
 * Certain events allow some players to deduct more information about
 * affinities while others can only make few safe assumptions.
 *
 * Consider this example:
 * Player 1 (P1) and Player 3 (P3) are re
 * P2 and P4 are kontra
 *
 * P3 opens the game by playing the queen of clubs.
 *
 * The affinities between all players will now look like this:
 *
 * |    | P1 | P2 | P3 | P4 |
 * | P1 |  * | -1 | +1 | -1 |
 * | P2 |  0 |  * | -1 |  0 |
 * | P3 |  0 |  0 |  * |  0 |
 * | P4 |  0 |  0 | -1 |  * |
 *
 * (a * marks "is the same player", effectively this will have a value of 0)
 * A single "Affinities" instance corresponds to one row in the table above.
 * i.e. P1's affinities for all other players are shown in the first row.
 */

interface PlayerAffinity {
  player: Player;
  affinity: number;
  declaredParty: boolean; // TODO: do we need to remember anything but the affinity score really?
  playedQueenOfClubs: boolean;
}

export class Affinities {
  me: Player;
  affinityTable: PlayerAffinity[] = []; // TODO: this should be a dictionary with the player as key

  constructor(me: Player, players?: Player[]) {
    this.me = me;
    this.setPlayers(players || []);
  }

  setPlayers(allPlayers: Player[]) {
    this.affinityTable = allPlayers
      .filter((player) => player.id !== this.me.id)
      .map((player) => ({
        player: player,
        affinity: 0,
        declaredParty: false,
        playedQueenOfClubs: false,
      }));
  }

  private suggestPartyForPlayer(player: Player, party: PartyName): void {
    this.setAffinity(player, getPartyName(this.me) === party ? 1 : -1);
    this.balanceAffinities();
  }

  suggestKontraFor(player: Player): void {
    this.suggestPartyForPlayer(player, PartyName.Kontra);
  }

  suggestReFor(player: Player): void {
    this.suggestPartyForPlayer(player, PartyName.Re);
  }

  declaresParty(player: Player, playedQueenOfClubs?: boolean) {
    if (this.isMe(player)) return;
    if (this.isInMyParty(player)) {
      this.affinityTable.forEach((x) => {
        this.setAffinity(x.player, this.isInMyParty(x.player) ? 1 : -1);
      });
    } else {
      this.setAffinity(player, -1);
      // this will only happen is Queen of Clubs is played twice by the same player
      if (this.hasPlayedQueenOfClubs(player) && playedQueenOfClubs) {
        this.makeTeammatesExcept(player);
      }
    }
    this.getContainerFor(player).declaredParty = true;
    if (this.affinityTable.filter((x) => x.declaredParty).length === 2) {
      this.setAllAffinities();
    }
    this.balanceAffinities();
  }

  for(player: Player) {
    return this.getContainerFor(player).affinity;
  }

  hasPlayedQueenOfClubs(player: Player): boolean {
    return this.getContainerFor(player).playedQueenOfClubs;
  }

  hasDeclaredParty(player: Player): boolean {
    return this.getContainerFor(player).declaredParty;
  }

  setAffinity(player: Player, value: number, hasDeclared: boolean = false) {
    if (!this.isMe(player) && !this.hasDeclaredParty(player)) {
      let index = this.affinityTable.findIndex(
        (x) => x.player.id === player.id
      );
      this.affinityTable[index].affinity = value;
      this.affinityTable[index].declaredParty = hasDeclared;
    }
    this.balanceAffinities();
  }

  reset() {
    this.setPlayers(this.affinityTable.map((x) => x.player));
  }

  private makeTeammatesExcept(player: Player) {
    this.affinityTable
      .filter(
        (playerAffinity) =>
          !this.isMe(playerAffinity.player) &&
          playerAffinity.player.id !== player.id
      )
      .forEach((playerAffinity) => this.setAffinity(playerAffinity.player, 1));
  }

  private setAllAffinities(): void {
    this.affinityTable.forEach((x) => {
      this.setAffinity(x.player, this.isInMyParty(x.player) ? 1 : -1);
    });
  }

  private isInMyParty(player: Player) {
    return this.me.isRe() === player.isRe();
  }

  private isMe(player: Player) {
    return this.me.id === player.id;
  }

  private getContainerFor(player: Player): PlayerAffinity {
    return this.affinityTable.find((x) => x.player.id === player.id)!;
  }

  private affinitySum(): number {
    return this.affinityTable.reduce(
      (accu, playerAffinity) => accu + playerAffinity.affinity,
      0
    );
  }

  private balanceAffinities(): void {
    if (this.affinitySum() == -2) {
      this.affinityTable.forEach((pA) => {
        if (pA.affinity === 0) {
          pA.affinity = 1;
          return;
        }
      });
    }
  }
}
