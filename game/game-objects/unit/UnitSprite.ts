import { AnimatedSprite, Movable, Sprite } from "@gaiaengine/2d";
import TileFaction from "../../data/tile/TileFaction.js";
import { UnitMetadata } from "../../data/unit/UnitData.js";
import UnitManager from "../../data/unit/UnitManager.js";
import spritesheets from "./unit-spritesheets.json" with { type: "json" };

export default class UnitSprite extends Movable {
  private metadata: UnitMetadata | undefined;
  private sprite: AnimatedSprite | undefined;

  constructor(public unitId: number, private faction: TileFaction) {
    super(0, 0);
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

  private playAnimation(animation: string) {
    if (!this.metadata) return;
    this.sprite?.remove();

    const atlas = (spritesheets as any)[this.metadata.key][animation];
    const firstFrame = Object.values(atlas.frames)[0] as any;

    this.sprite = new AnimatedSprite(
      0,
      0,
      `/assets/units/sprites/${this.metadata.key}/${this.faction}/${animation}.png`,
      atlas,
      animation,
      24,
    );

    this.sprite.setPivot(
      firstFrame.anchor.x - firstFrame.frame.w / 2,
      firstFrame.anchor.y - firstFrame.frame.h / 2,
    );

    this.append(this.sprite);
  }

  public playIdleAnimation() {
    this.playAnimation("idle");
    this.stop();
  }

  public playMoveAnimation(x: number, y: number) {
    this.playAnimation("walk");

    const angle = Math.atan2(y - this.y, x - this.x);
    this.move(angle, 100);
  }
}
