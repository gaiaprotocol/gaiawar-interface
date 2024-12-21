import { Coordinates, GameObject } from "@gaiaengine/2d";
import BattlegroundContract from "../contracts/core/BattlegroundContract.js";
import GameConfig from "../core/GameConfig.js";
import { UnitQuantity } from "../data/TileData.js";
import AvailableArea from "./AvailableArea.js";
import Ground from "./ground/Ground.js";
import Tile from "./Tile.js";

class World extends GameObject {
  private tileContainer = new GameObject(0, 0);
  private tiles: { [key: string]: Tile } = {};

  private showingAreaType:
    | "constructable"
    | "movable"
    | "attackable"
    | "rangedAttackable"
    | undefined;
  private showingAreaUnitTileCoord: Coordinates | undefined;
  private showingAreaUnits: UnitQuantity[] | undefined;

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
      AvailableArea,
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

    this.updateArea();
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

    this.updateArea();
  }

  private updateArea() {
    if (this.showingAreaType === "constructable") {
      AvailableArea.updateConstructableArea(this.tiles);
    } else if (this.showingAreaType === "movable") {
      AvailableArea.updateMovableArea(
        this.showingAreaUnitTileCoord!,
        this.showingAreaUnits!,
        this.tiles,
      );
    }
  }

  public showConstructableArea() {
    this.showingAreaType = "constructable";
    AvailableArea.updateConstructableArea(this.tiles);
  }

  public hideConstructableArea() {
    if (this.showingAreaType === "constructable") {
      this.showingAreaType = undefined;
      AvailableArea.clearAll();
    }
  }

  public showMovableArea(unitTileCoord: Coordinates, units: UnitQuantity[]) {
    this.showingAreaType = "movable";
    this.showingAreaUnitTileCoord = unitTileCoord;
    this.showingAreaUnits = units;
    AvailableArea.updateMovableArea(unitTileCoord, units, this.tiles);
  }

  public hideMovableArea() {
    if (this.showingAreaType === "movable") {
      this.showingAreaType = undefined;
      this.showingAreaUnitTileCoord = undefined;
      this.showingAreaUnits = undefined;
      AvailableArea.clearAll();
    }
  }

  public showAttackableArea(unitTileCoord: Coordinates, units: UnitQuantity[]) {
    this.showingAreaType = "attackable";
    this.showingAreaUnitTileCoord = unitTileCoord;
    this.showingAreaUnits = units;
    AvailableArea.updateAttackableArea(unitTileCoord, units, this.tiles);
  }

  public hideAttackableArea() {
    if (this.showingAreaType === "attackable") {
      this.showingAreaType = undefined;
      this.showingAreaUnitTileCoord = undefined;
      this.showingAreaUnits = undefined;
      AvailableArea.clearAll();
    }
  }

  public showRangedAttackableArea(
    unitTileCoord: Coordinates,
    units: UnitQuantity[],
  ) {
    this.showingAreaType = "rangedAttackable";
    this.showingAreaUnitTileCoord = unitTileCoord;
    this.showingAreaUnits = units;
    AvailableArea.updateRangedAttackableArea(unitTileCoord, units, this.tiles);
  }

  public hideRangedAttackableArea() {
    if (this.showingAreaType === "rangedAttackable") {
      this.showingAreaType = undefined;
      this.showingAreaUnitTileCoord = undefined;
      this.showingAreaUnits = undefined;
      AvailableArea.clearAll();
    }
  }
}

export default new World();
