import { GameNode } from "@gaiaengine/2d";
import TileBase from "../TileBase.js";

export default abstract class PulseTileOverlay extends TileBase {
  protected fadingSpeed = 0;
  protected minFadingSpeed = -Infinity;
  protected maxFadingSpeed = Infinity;
  protected fadingAccel = 0;

  protected isPulsing = false;
  protected pulseToValue = 0;
  protected pulseDuration = 1;

  constructor(
    tileX: number,
    tileY: number,
    ...gameNodes: (GameNode | undefined)[]
  ) {
    super(tileX, tileY, ...gameNodes);

    this.isPulsing = true;
    this.alpha = 0;
    this.fadeIn();
  }

  private fadeIn(): void {
    this.fadingSpeed = (1 - this.alpha) / this.pulseDuration;
  }

  private fadeOut(): void {
    this.fadingSpeed = (0 - this.alpha) / this.pulseDuration;
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
