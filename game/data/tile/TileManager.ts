import { EventContainer } from "@common-module/ts";
import { TileRange } from "@gaiaengine/2d";
import BattlegroundContract from "../../contracts/core/BattlegroundContract.js";
import TileData from "./TileData.js";

class TileManager extends EventContainer<{
  tilesLoaded: (tiles: Record<number, Record<number, TileData>>) => void;
}> {
  private currentTileRange: TileRange = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  };

  constructor() {
    super();
    setInterval(() => this.loadTiles(), 2000);
  }

  public async setTileRange(range: TileRange) {
    this.currentTileRange = range;
    this.loadTiles();
  }

  private async loadTiles() {
    const tiles = await BattlegroundContract.getTiles({
      x: this.currentTileRange.startX,
      y: this.currentTileRange.startY,
    }, {
      x: this.currentTileRange.endX,
      y: this.currentTileRange.endY,
    });

    const tileMap: Record<number, Record<number, TileData>> = {};

    let i = 0;
    for (
      let x = this.currentTileRange.startX;
      x <= this.currentTileRange.endX;
      x++
    ) {
      tileMap[x] = {};
      for (
        let y = this.currentTileRange.startY;
        y <= this.currentTileRange.endY;
        y++
      ) {
        tileMap[x][y] = tiles[i++];
      }
    }

    this.emit("tilesLoaded", tileMap);
  }
}

export default new TileManager();
