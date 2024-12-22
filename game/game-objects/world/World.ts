import { Coordinates, GameObject, TileRange } from "@gaiaengine/2d";
import GaiaWarConfig from "../../config/GaiaWarConfig.js";
import TileData from "../../data/tile/TileData.js";
import Ground from "../ground/Ground.js";
import Tile from "./Tile.js";

interface WorldOptions {
  onTileRangeChanged: (range: TileRange) => void;
}

export default class World extends GameObject {
  private tileContainer = new GameObject(0, 0);
  private tiles: Record<number, Record<number, Tile>> = {};

  constructor(options: WorldOptions) {
    super(0, 0);
    this.append(
      new Ground({
        extraLoadTileCount: GaiaWarConfig.headquartersSearchRange,
        debounceDelay: 200,
        tileFadeDuration: 0.2,
        onLoadTiles: (coordinates) => this.createTiles(coordinates),
        onDeleteTiles: (coordinates) => this.deleteTiles(coordinates),
        onTileRangeChanged: (range) => options.onTileRangeChanged(range),
      }),
      this.tileContainer,
    );
  }

  private createTiles(coordinates: Coordinates[]) {
    for (const c of coordinates) {
      const tile = new Tile(c);
      if (!this.tiles[c.x]) {
        this.tiles[c.x] = {};
      }
      this.tiles[c.x][c.y] = tile;
      this.tileContainer.append(tile);
    }
  }

  private deleteTiles(coordinates: Coordinates[]) {
    for (const c of coordinates) {
      if (this.tiles[c.x] && this.tiles[c.x][c.y]) {
        this.tiles[c.x][c.y].remove();
        delete this.tiles[c.x][c.y];
        if (Object.keys(this.tiles[c.x]).length === 0) {
          delete this.tiles[c.x];
        }
      }
    }
  }

  public updateTiles(tiles: Record<number, Record<number, TileData>>) {
    for (const x in tiles) {
      for (const y in tiles[x]) {
        const tileData = tiles[x][y];
        const tile = this.tiles[parseInt(x)]?.[parseInt(y)];
        if (tile) {
          tile.setData(tileData);
        }
      }
    }
  }
}
