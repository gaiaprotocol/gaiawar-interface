import { Sprite } from "@gaiaengine/2d";

export default class TileSelectedOverlay extends Sprite {
  constructor() {
    super(-999999, -999999, "/assets/tile/selected.png");
  }

  public setPosition(x: number, y: number): this {
    this.zIndex = -y;
    return super.setPosition(x, y);
  }
}
