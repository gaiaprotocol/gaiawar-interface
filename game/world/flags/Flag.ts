import { GameObject, Sprite } from "@gaiaengine/2d";

export default abstract class Flag extends GameObject {
  constructor(faction: "player" | "enemy") {
    super(0, 0);
    this.append(new Sprite(0, 0, `/assets/flags/flag-${faction}.png`)).setPivot(
      -19,
      64,
    );
  }
}
