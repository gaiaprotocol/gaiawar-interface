import { RectangleNode } from "@gaiaengine/2d";
import GameConfig from "../../GameConfig.js";
import TileBase from "../TileBase.js";

export default class BuildableTileOverlay extends TileBase {
  constructor(tileX: number, tileY: number) {
    super(tileX, tileY);
    const rect = new RectangleNode(
      0,
      0,
      GameConfig.tileSize,
      GameConfig.tileSize,
      0x00ff00,
      { width: 2, color: 0x00ff00 },
    );
    rect.alpha = 0.2;
    this.append(rect);
  }
}
