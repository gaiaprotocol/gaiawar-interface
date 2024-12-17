import { AnimatedSprite, GameObject } from "@gaiaengine/2d";
import UnitManager from "../../data/unit/UnitManager.js";
import spritesheets from "./unit-spritesheets.json" with { type: "json" };

export default class SpriteUnit extends GameObject {
  constructor(
    x: number,
    y: number,
    unitId: number,
    faction: "player" | "enemy",
  ) {
    super(x, y);

    const metadata = UnitManager.getUnitMetadata(unitId);
    if (metadata) {
      const animation = "idle";

      const sprite = new AnimatedSprite(
        0,
        0,
        `/assets/units/sprites/${metadata.key}/${faction}/${animation}.png`,
        (spritesheets as any)[metadata.key][animation],
        animation,
        24,
      );
      this.append(sprite);
    }
  }
}
