import { Coordinates, GameNode, GameObject } from "@gaiaengine/2d";
import GaiaWarConfig from "../../config/GaiaWarConfig.js";

export default abstract class TileObject extends GameObject {
  constructor(coord: Coordinates, ...gameNodes: (GameNode | undefined)[]) {
    const x = coord.x * GaiaWarConfig.tileSize;
    const y = coord.y * GaiaWarConfig.tileSize;
    super(x, y, ...gameNodes);
    this.zIndex = -y;
  }

  public setPosition(x: number, y: number): this {
    this.zIndex = -y;
    return super.setPosition(x, y);
  }

  public setTilePosition(coord: Coordinates): this {
    return super.setPosition(
      coord.x * GaiaWarConfig.tileSize,
      coord.y * GaiaWarConfig.tileSize,
    );
  }
}
