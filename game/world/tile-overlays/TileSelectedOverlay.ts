import { Sprite } from "@gaiaengine/2d";
import GameConfig from "../../GameConfig.js";

class TileSelectedOverlay extends Sprite {
  constructor() {
    super(-999999, -999999, "/assets/tile/selected.png");
  }

  public setPosition(x: number, y: number): this {
    this.zIndex = -y;
    return super.setPosition(x, y);
  }

  public setTilePosition(x: number, y: number): this {
    return super.setPosition(x * GameConfig.tileSize, y * GameConfig.tileSize);
  }
}

export default new TileSelectedOverlay();
