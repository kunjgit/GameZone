import { Player } from "@/models/player";
import { PartyName } from "@/models/party";
import { Extra } from "@/models/extras";
import { v4 as uuidv4 } from "uuid";

export class PlayerBuilder {
  name: string;
  points: number = 0;
  extras: Extra[] = [];
  party: string = "re";
  id: string = uuidv4();

  constructor(name: string) {
    this.name = name;
  }

  withPoints(points: number): PlayerBuilder {
    this.points = points;
    return this;
  }

  withParty(party: string): PlayerBuilder {
    this.party = party;
    return this;
  }

  withExtra(extra: Extra): PlayerBuilder {
    this.extras.push(extra);
    return this;
  }

  withId(id: string): PlayerBuilder {
    this.id = id;
    return this;
  }

  build() {
    const player = new Player(this.name);
    player.isRe = () => this.party === PartyName.Re;
    player.isKontra = () => this.party !== PartyName.Re;
    player.points = () => this.points;
    player.trickStack.extras = () => this.extras;
    player.id = this.id;
    return player;
  }
}
