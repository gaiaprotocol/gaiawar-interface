import { GameObject, Sprite } from "@gaiaengine/2d";
import { Spine } from "@gaiaengine/2d-spine";
import TileFaction from "../../data/tile/TileFaction.js";
import UnitManager from "../../data/unit/UnitManager.js";

export default class UnitSpine extends GameObject {
  constructor(public unitId: number, faction: TileFaction) {
    super(0, 0);

    const metadata = UnitManager.getUnitMetadata(unitId);
    if (metadata) {
      const animation = "idle";

      const spine = new Spine(0, 0, {
        atlas: `/assets/${metadata.spine.atlas}`,
        json: `/assets/${metadata.spine.json}`,
        png: `/assets/${metadata.spine.png}`,
        animation,
        skins: [faction == "player" ? "green" : "red"],
        loop: true,
      });
      spine.scale = 0.5;

      this.append(
        spine,
        metadata.shadowSize === "large"
          ? new Sprite(0, 0, "/assets/units/shadow-large.png")
          : new Sprite(0, 0, "/assets/units/shadow.png"),
      );
    }
  }
}
