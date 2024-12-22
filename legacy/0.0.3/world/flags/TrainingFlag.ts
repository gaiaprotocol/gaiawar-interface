import { Sprite } from "@gaiaengine/2d";
import Flag from "./Flag.js";

export default class TrainingFlag extends Flag {
  constructor(faction: "player" | "enemy") {
    super(faction);
    this.append(new Sprite(1, -25, "/assets/flags/icons/training.png"));
  }
}
