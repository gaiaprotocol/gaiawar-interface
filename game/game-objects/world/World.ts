import {
  compareCoordinates,
  Coordinates,
  GameObject,
  TileRange,
} from "@gaiaengine/2d";
import GaiaWarConfig from "../../config/GaiaWarConfig.js";
import PendingCommand from "../../data/pending-command/PendingCommand.js";
import TileData from "../../data/tile/TileData.js";
import Ground from "../ground/Ground.js";
import Tile from "./Tile.js";

interface WorldOptions {
  onTileRangeChanged: (range: TileRange) => void;
}

export default class World extends GameObject {
  private tileContainer = new GameObject(0, 0);
  private tiles: Record<number, Record<number, Tile>> = {};
  private previousPendingCommands: PendingCommand[] = [];

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

  public playSelectEffect(coord: Coordinates) {
    this.tiles[coord.x]?.[coord.y]?.playSelectEffect();
  }

  public updatePendingCommands(pendingCommands: PendingCommand[]) {
    for (const pendingCommand of pendingCommands) {
      if (
        !this.previousPendingCommands.find((pc) =>
          pc.type === pendingCommand.type &&
          pc.user === pendingCommand.user &&
          compareCoordinates(pc.from, pendingCommand.from) &&
          compareCoordinates(pc.to, pendingCommand.to)
        )
      ) {
        if (pendingCommand.from) {
          const fromTile = this.tiles[pendingCommand.from.x]
            ?.[pendingCommand.from.y];
          fromTile?.addPendingCommand(pendingCommand);
        }

        const toTile = this.tiles[pendingCommand.to.x]?.[pendingCommand.to.y];
        toTile?.addPendingCommand(pendingCommand);
      }
    }

    for (const pendingCommand of this.previousPendingCommands) {
      if (
        !pendingCommands.find((pc) =>
          pc.type === pendingCommand.type &&
          pc.user === pendingCommand.user &&
          compareCoordinates(pc.from, pendingCommand.from) &&
          compareCoordinates(pc.to, pendingCommand.to)
        )
      ) {
        if (pendingCommand.from) {
          const fromTile = this.tiles[pendingCommand.from.x]
            ?.[pendingCommand.from.y];
          fromTile?.removePendingCommand(pendingCommand);
        }

        const toTile = this.tiles[pendingCommand.to.x]?.[pendingCommand.to.y];
        toTile?.removePendingCommand(pendingCommand);
      }
    }

    this.previousPendingCommands = pendingCommands;
  }
}
