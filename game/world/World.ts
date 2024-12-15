import { Coordinates, GameObject, TileRange } from "@gaiaengine/2d";
import BattlegroundContract from "../contracts/BattlegroundContract.js";
import GameConfig from "../GameConfig.js";
import BuildableArea from "./BuildableArea.js";
import Ground from "./ground/Ground.js";
import Tile from "./Tile.js";

class World extends GameObject {
  private tileContainer = new GameObject(0, 0);
  private tiles: { [key: string]: Tile } = {};
  private tileRange: TileRange = { startX: 0, startY: 0, endX: 0, endY: 0 };

  constructor() {
    super(0, 0);
    this.append(
      new Ground({
        extraTileLoadWidth: GameConfig.headquartersSearchRange *
          GameConfig.tileSize,
        extraTileLoadHeight: GameConfig.headquartersSearchRange *
          GameConfig.tileSize,
        onLoadTiles: (coordinates) => this.loadTiles(coordinates),
        onDeleteTiles: (coordinates) => this.deleteTiles(coordinates),
        onTileRangeChanged: (range) => this.tileRange = range,
      }),
      BuildableArea,
      this.tileContainer,
    );
  }

  private async loadTiles(coordinates: Coordinates[]) {
    const tileInfoSet = await BattlegroundContract.getTiles(coordinates);
    for (const [index, c] of coordinates.entries()) {
      const tileInfo = tileInfoSet[index];
      const key = `${c.x},${c.y}`;
      const tile = new Tile(c.x, c.y, tileInfo);
      this.tiles[key] = tile;
      this.tileContainer.append(tile);
    }
    BuildableArea.updateArea(this.tiles, this.tileRange);
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
