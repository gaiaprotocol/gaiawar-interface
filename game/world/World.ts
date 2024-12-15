import { Coordinates, GameObject } from "@gaiaengine/2d";
import BattlegroundContract from "../contracts/BattlegroundContract.js";
import Ground from "./ground/Ground.js";
import Tile from "./Tile.js";

class World extends GameObject {
  private tiles: { [key: string]: Tile } = {};

  constructor() {
    super(0, 0);
    this.append(
      new Ground({
        onLoadTiles: (coordinates) => this.loadTiles(coordinates),
        onDeleteTiles: (coordinates) => this.deleteTiles(coordinates),
      }),
    );
  }

  private async loadTiles(coordinates: Coordinates[]) {
    const tileInfoSet = await BattlegroundContract.getTiles(coordinates);
    for (const [index, c] of coordinates.entries()) {
      const tileInfo = tileInfoSet[index];
      const key = `${c.x},${c.y}`;
      const tile = new Tile(tileInfo);
      this.tiles[key] = tile;
      this.append(tile);
    }
  }

  private deleteTiles(coordinates: Coordinates[]) {
    for (const c of coordinates) {
      const key = `${c.x},${c.y}`;
      const tile = this.tiles[key];
      if (tile) {
        tile.remove();
        delete this.tiles[key];
      }
    }
  }
}

export default new World();
