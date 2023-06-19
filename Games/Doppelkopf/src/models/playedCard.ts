import { Card } from "@/models/card";
import { Player } from "./player";

export class PlayedCard {
  card: Card;
  player: Player;
  id: string;

  constructor(card: Card, player: Player) {
    this.card = card;
    this.player = player;
    this.id = `${this.card.id}-${this.player.id}`;
  }
}
