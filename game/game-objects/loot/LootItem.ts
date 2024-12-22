import { Fadeable, Sprite } from "@gaiaengine/2d";

export default class LootItem extends Fadeable {
  constructor(x: number, y: number) {
    super(x, y);
    this.append(new Sprite(0, 0, "/assets/loot/loot.png"));
    this.fadeIn(0.2);
  }
}
