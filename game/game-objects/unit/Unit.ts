import { Movable, RandomSoundLooper } from "@gaiaengine/2d";
import TileFaction from "../../data/tile/TileFaction.js";

export default abstract class Unit extends Movable {
  private moveSound = new RandomSoundLooper([
    "/assets/sfx/walk/fabric/dirt1.wav",
    "/assets/sfx/walk/fabric/dirt2.wav",
    "/assets/sfx/walk/fabric/dirt3.wav",
    "/assets/sfx/walk/fabric/dirt4.wav",
  ]);

  constructor(public unitId: number, protected faction: TileFaction) {
    super(0, 0);
  }

  protected abstract playAnimation(animation: string): void;

  public playIdleAnimation() {
    this.playAnimation("idle");
    this.stop();
    this.moveSound.stop();
  }

  public playMoveAnimation(x: number, y: number) {
    this.playAnimation("walk");

    const angle = Math.atan2(y - this.y, x - this.x);
    this.move(angle, 100);

    this.moveSound.play();
  }

  public playRangedAttackAnimation() {
    this.playAnimation("ranged-attack");
  }
}
