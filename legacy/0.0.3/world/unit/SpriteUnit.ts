import { AnimatedSprite, GameObject, Sprite } from "@gaiaengine/2d";
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

      const atlas = (spritesheets as any)[metadata.key][animation];
      const firstFrame = Object.values(atlas.frames)[0] as any;

      const sprite = new AnimatedSprite(
        0,
        0,
        `/assets/units/sprites/${metadata.key}/${faction}/${animation}.png`,
        atlas,
        animation,
        24,
      );

      sprite.setPivot(
        firstFrame.anchor.x - firstFrame.frame.w / 2,
        firstFrame.anchor.y - firstFrame.frame.h / 2,
      );

      this.append(
        sprite,
        metadata.shadowSize === "large"
          ? new Sprite(0, 0, "/assets/units/shadow-large.png")
          : new Sprite(0, 0, "/assets/units/shadow.png"),
      );
    }
  }
}
