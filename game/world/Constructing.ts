import { Fadeable, Sprite } from "@gaiaengine/2d";
import ConstructingFlag from "./flags/ConstructingFlag.js";

export default class Constructing extends Fadeable {
  constructor(faction: "player" | "enemy") {
    super(0, 0);
    this.append(
      new Sprite(0, 0, "/assets/buildings/constructing.png"),
      new ConstructingFlag(faction),
    );
    this.alpha = 0;
    this.fadeIn(0.2);
  }
}
