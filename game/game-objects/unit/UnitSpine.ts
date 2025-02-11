import { Sprite } from "@gaiaengine/2d";
import { Spine } from "@gaiaengine/2d-spine";
import TileFaction from "../../data/tile/TileFaction.js";
import UnitManager from "../../data/unit/UnitManager.js";
import Unit from "./Unit.js";

export default class UnitSpine extends Unit {
  private spine: Spine | undefined;

  constructor(unitId: number, faction: TileFaction) {
    super(unitId, faction);

    const metadata = UnitManager.getUnitMetadata(unitId);
    if (metadata) {
      const animation = "idle";

      this.spine = new Spine(0, 0, {
        atlas: `/assets/${metadata.spine.atlas}`,
        json: `/assets/${metadata.spine.skeletonData}`,
        texture: `/assets/${metadata.spine.texture}`,
        animation,
        skins: [faction == "player" ? "green" : "red"],
        loop: true,
      });
      this.scale = 0.5;

      this.append(
        this.spine,
        metadata.shadowSize === "large"
          ? new Sprite(0, 0, "/assets/units/shadow-large.png")
          : new Sprite(0, 0, "/assets/units/shadow.png"),
      );
    }
  }

  protected playAnimation(animation: string) {
    if (this.spine) {
      this.spine.animation = animation;
    }
  }
}
