import { AnimatedSprite, GameObject } from "@gaiaengine/2d";
import UnitManager from "../../data/unit/UnitManager.js";

export default class SpriteUnit extends GameObject {
  constructor(x: number, y: number, unitId: number) {
    super(x, y);

    const metadata = UnitManager.getUnitMetadata(unitId);
    if (metadata) {
      const frames: any = {};
      for (let i = 0; i < 27; i++) {
        frames[`idle${i}`] = {
          frame: { x: i * 42, y: 0, w: 42, h: 80 },
        };
      }

      const sprite = new AnimatedSprite(
        0,
        0,
        "/assets/units/test-swordsman-sprite.png",
        {
          frames,
          meta: { scale: 1 },
          animations: {
            idle: Array.from({ length: 27 }, (_, i) => `idle${i}`),
          },
        },
        "idle",
        24,
      );
      this.append(sprite);
    }
  }
}
