import { RectangleNode } from "@gaiaengine/2d";
import TileBase from "../TileBase.js";
import GameConfig from "../../GameConfig.js";

export default class UnbuildableTileOverlay extends TileBase {
  constructor(tileX: number, tileY: number) {
    super(tileX, tileY);
    const rect = new RectangleNode(
      0,
      0,
      GameConfig.tileSize,
      GameConfig.tileSize,
      0xff0000,
      { width: 2, color: 0xff0000 },
    );
    rect.alpha = 0.2;
    this.append(rect);
  }
}
