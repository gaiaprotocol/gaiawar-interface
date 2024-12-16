import { el } from "@common-module/app";
import { DomWrapperNode, GameObject, Sprite } from "@gaiaengine/2d";

export default abstract class Flag extends GameObject {
  constructor(faction: "player" | "enemy") {
    super(0, 0);
    this.append(new Sprite(0, 0, `/assets/flags/flag-${faction}.png`)).setPivot(
      -19,
      64,
    );

    this.scale = 2;
    this.rotation = Math.PI / 4;
    this.append(new DomWrapperNode(0, 0, "", el("", "TEST!")));
  }
}
