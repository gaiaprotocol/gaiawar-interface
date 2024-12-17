import { GameObject } from "@gaiaengine/2d";
import { Spine } from "@gaiaengine/2d-spine";
import UnitManager from "../../data/unit/UnitManager.js";

export default class SpineUnit extends GameObject {
  constructor(
    x: number,
    y: number,
    unitId: number,
    faction: "player" | "enemy",
  ) {
    super(x, y);
    const metadata = UnitManager.getUnitMetadata(unitId);
    if (metadata) {
      const spine = new Spine(0, 0, {
        atlas: `/assets/${metadata.spine.atlas}`,
        json: `/assets/${metadata.spine.json}`,
        png: `/assets/${metadata.spine.png}`,
        animation: "idle",
        skins: [faction ? "green" : "red"],
        loop: true,
      });
      spine.scale = 0.5;
      this.append(spine);
    }
  }
}
