import { Coordinates, GameObject } from "@gaiaengine/2d";
import BattlegroundContract from "../contracts/core/BattlegroundContract.js";
import GameConfig from "../core/GameConfig.js";
import BuildableArea from "./BuildableArea.js";
import Ground from "./ground/Ground.js";
import Tile from "./Tile.js";

class World extends GameObject {
  private tileContainer = new GameObject(0, 0);
  private tiles: { [key: string]: Tile } = {};
  private showingBuildableArea = false;

  constructor() {
    super(0, 0);
    this.append(
      new Ground({
        extraLoadTileCount: GameConfig.headquartersSearchRange,
        debounceDelay: 200,
        tileFadeDuration: 0.2,
        onLoadTiles: (coordinates) => this.loadTiles(coordinates),
        onDeleteTiles: (coordinates) => this.deleteTiles(coordinates),
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

    if (this.showingBuildableArea) {
      BuildableArea.updateArea(this.tiles);
    }
  }

  public getTile(coordinates: Coordinates): Tile | undefined {
    return this.tiles[`${coordinates.x},${coordinates.y}`];
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

    if (this.showingBuildableArea) {
      BuildableArea.updateArea(this.tiles);
    }
  }

  public showBuildableArea() {
    this.showingBuildableArea = true;
    BuildableArea.updateArea(this.tiles);
  }

  public hideBuildableArea() {
    this.showingBuildableArea = false;
    BuildableArea.clearAll();
  }
}

export default new World();
