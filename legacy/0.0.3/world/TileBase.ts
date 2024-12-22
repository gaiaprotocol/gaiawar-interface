import { Coordinates, GameNode, GameObject } from "@gaiaengine/2d";
import GameConfig from "../config/GaiaWarConfig.js";

export default abstract class TileBase extends GameObject {
  constructor(
    tileX: number,
    tileY: number,
    ...gameNodes: (GameNode | undefined)[]
  ) {
    const x = tileX * GameConfig.tileSize;
    const y = tileY * GameConfig.tileSize;
    super(x, y, ...gameNodes);
    this.zIndex = -y;
  }

  public setPosition(x: number, y: number): this {
    this.zIndex = -y;
    return super.setPosition(x, y);
  }

  public setTilePosition(coordinates: Coordinates): this {
    return super.setPosition(
      coordinates.x * GameConfig.tileSize,
      coordinates.y * GameConfig.tileSize,
    );
  }
}
