import { EventContainer } from "@common-module/ts";
import { TileRange } from "@gaiaengine/2d";
import BattlegroundContract from "../../contracts/core/BattlegroundContract.js";
import TileData from "./TileData.js";

type TileMap = Record<number, Record<number, TileData>>;

class TileManager extends EventContainer<{
  tilesLoaded: (tileMap: TileMap) => void;
}> {
  private currentTileRange: TileRange = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  };
  private currentTileMap: TileMap = {};

  public getCurrentTileRange() {
    return this.currentTileRange;
  }

  public getCurrentTileData(x: number, y: number): TileData | undefined {
    return this.currentTileMap[x]?.[y];
  }

  constructor() {
    super();
    setInterval(() => this.loadTiles(), 2000);
  }

  public async setTileRange(range: TileRange) {
    this.currentTileRange = range;
    this.loadTiles();
  }

  private async loadTiles() {
    const range = this.currentTileRange;

    const tiles = await BattlegroundContract.getTiles(
      { x: range.startX, y: range.startY },
      { x: range.endX, y: range.endY },
    );

    this.currentTileMap = {};

    let i = 0;
    for (let x = range.startX; x <= range.endX; x++) {
      this.currentTileMap[x] = {};
      for (let y = range.startY; y <= range.endY; y++) {
        this.currentTileMap[x][y] = tiles[i++];
      }
    }

    this.emit("tilesLoaded", this.currentTileMap);
  }
}

export default new TileManager();
