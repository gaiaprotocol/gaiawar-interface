import { Coordinates, GameNode } from "@gaiaengine/2d";
import TileObject from "../world/TileObject.js";

export default abstract class PulsingTile extends TileObject {
  protected fadingSpeed = 0;
  protected minFadingSpeed = -Infinity;
  protected maxFadingSpeed = Infinity;
  protected fadingAccel = 0;

  protected isPulsing = false;
  protected pulseToValue = 0;
  protected pulseDuration = 1;

  constructor(coord: Coordinates, ...gameNodes: (GameNode | undefined)[]) {
    super(coord, ...gameNodes);

    this.isPulsing = true;
    this.fadeIn();
  }

  private fadeIn(): void {
    this.alpha = 0;
    this.fadingSpeed = 1 / this.pulseDuration;
  }

  private fadeOut(): void {
    this.alpha = 1;
    this.fadingSpeed = -1 / this.pulseDuration;
  }

  protected update(deltaTime: number): void {
    this.fadingSpeed += this.fadingAccel * deltaTime;

    if (this.fadingSpeed < this.minFadingSpeed) {
      this.fadingSpeed = this.minFadingSpeed;
    }
    if (this.fadingSpeed > this.maxFadingSpeed) {
      this.fadingSpeed = this.maxFadingSpeed;
    }

    if (this.fadingSpeed !== 0) {
      this.alpha += this.fadingSpeed * deltaTime;

      if (this.alpha < 0) {
        this.alpha = 0;
        this.fadingSpeed = 0;

        if (this.isPulsing) {
          this.fadeIn();
        }
      }

      if (this.alpha > 1) {
        this.alpha = 1;
        this.fadingSpeed = 0;

        if (this.isPulsing) {
          this.fadeOut();
        }
      }
    }

    super.update(deltaTime);
  }
}
