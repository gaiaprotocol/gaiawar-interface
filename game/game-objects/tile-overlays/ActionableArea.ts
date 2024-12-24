import { Coordinates, GameObject } from "@gaiaengine/2d";
import TileAvailableMap from "../../data/tile/TileAvailableMap.js";
import TileAvailableValue from "../../data/tile/TileAvailableValue.js";
import AvailableTile from "./AvailableTile.js";
import UnavailableTile from "./UnavailableTile.js";

export default class ActionableArea extends GameObject {
  private tiles: Record<number, Record<number, GameObject>> = {};

  constructor() {
    super(0, 0);
  }

  private createTile(coord: Coordinates, value: number) {
    let tile;

    if (value === TileAvailableValue.AVAILABLE) {
      tile = new AvailableTile(coord);
    } else if (value === TileAvailableValue.UNAVAILABLE) {
      tile = new UnavailableTile(coord);
    }

    if (tile) {
      if (!this.tiles[coord.x]) this.tiles[coord.x] = {};
      this.tiles[coord.x][coord.y] = tile.appendTo(this);
    }
  }

  public updateMap(map: TileAvailableMap) {
    for (const x in map) {
      for (const y in map[x]) {
        const value = map[x][y];
        const tile = this.tiles[x]?.[y];

        if (!tile) {
          this.createTile({ x: parseInt(x), y: parseInt(y) }, value);
          continue;
        }

        const isAvailableTile = tile instanceof AvailableTile;
        if (
          (value === TileAvailableValue.AVAILABLE && !isAvailableTile) ||
          (value === TileAvailableValue.UNAVAILABLE && isAvailableTile)
        ) {
          tile.remove();
          this.createTile({ x: parseInt(x), y: parseInt(y) }, value);
        }
      }
    }

    for (const x in this.tiles) {
      for (const y in this.tiles[x]) {
        if (map[x]?.[y] === undefined) {
          this.tiles[x][y].remove();
          delete this.tiles[x][y];

          if (Object.keys(this.tiles[x]).length === 0) {
            delete this.tiles[x];
          }
        }
      }
    }
  }

  public clear(): this {
    this.tiles = {};
    return super.clear();
  }
}
