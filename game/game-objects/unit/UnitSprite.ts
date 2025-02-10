import { AnimatedSprite, Sprite } from "@gaiaengine/2d";
import TileFaction from "../../data/tile/TileFaction.js";
import { UnitMetadata } from "../../data/unit/UnitData.js";
import UnitManager from "../../data/unit/UnitManager.js";
import spritesheets from "./unit-spritesheets.json" with { type: "json" };
import Unit from "./Unit.js";

export default class UnitSprite extends Unit {
  private metadata: UnitMetadata | undefined;
  private sprite: AnimatedSprite | undefined;

  constructor(unitId: number, faction: TileFaction) {
    super(unitId, faction);
    this.metadata = UnitManager.getUnitMetadata(unitId);
    if (this.metadata) {
      this.append(
        this.metadata.shadowSize === "large"
          ? new Sprite(0, 0, "/assets/units/shadow-large.png")
          : new Sprite(0, 0, "/assets/units/shadow.png"),
      );
      this.playIdleAnimation();
    }
  }

  protected playAnimation(animation: string) {
    if (!this.metadata) return;
    this.sprite?.remove();

    const atlas = (spritesheets as any)[this.metadata.key][animation];
    const firstFrame = Object.values(atlas.frames)[0] as any;

    this.sprite = new AnimatedSprite(0, 0, {
      src:
        `/assets/units/sprites/${this.metadata.key}/${this.faction}/${animation}.png`,
      atlas,
      animation,
      fps: 24,
    });

    this.sprite.setPivot(
      firstFrame.anchor.x - firstFrame.frame.w / 2,
      firstFrame.anchor.y - firstFrame.frame.h / 2,
    );

    this.append(this.sprite);
  }
}
