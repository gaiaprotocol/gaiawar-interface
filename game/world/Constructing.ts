import { Fadeable, Sprite } from "@gaiaengine/2d";

export default class Constructing extends Fadeable {
  constructor() {
    super(0, 0);
    this.append(
      new Sprite(0, 0, "/assets/buildings/constructing.png"),
    );
    this.alpha = 0;
    this.fadeIn(0.2);
  }
}
