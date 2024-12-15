import { WalletLoginManager } from "@common-module/wallet-login";
import { GameObject, TileRange } from "@gaiaengine/2d";
import { zeroAddress } from "viem";
import BattlegroundContract from "../contracts/BattlegroundContract.js";
import BuildingManager from "../data/building/BuildingManager.js";
import GameConfig from "../GameConfig.js";
import Tile from "./Tile.js";

class BuildableArea extends GameObject {
  constructor() {
    super(0, 0);
  }

  public async updateArea(
    tiles: { [key: string]: Tile },
    tileRange: TileRange,
  ) {
    const walletAddress = WalletLoginManager.getLoggedInAddress();
    if (!walletAddress) return;

    const hasHeadquarters = await BattlegroundContract.hasHeadquarters(
      walletAddress,
    );

    const width = tileRange.endX - tileRange.startX + 1;
    const height = tileRange.endY - tileRange.startY + 1;

    const map: number[][] = new Array(height);
    for (let row = 0; row < height; row++) {
      map[row] = new Array(width).fill(0);
    }

    if (hasHeadquarters) {
      for (const tile of Object.values(tiles)) {
        if (tile.getOccupant() === walletAddress) {
          const constructionRange = BuildingManager.getConstructionRange(
            tile.getBuildingId(),
          );
          for (let x = -constructionRange; x <= constructionRange; x++) {
            for (let y = -constructionRange; y <= constructionRange; y++) {
              const tileX = tile.getTileX() + x;
              const tileY = tile.getTileY() + y;
              const localX = tileX - tileRange.startX;
              const localY = tileY - tileRange.startY;

              if (
                localY >= 0 && localY < height && localX >= 0 && localX < width
              ) {
                map[localY][localX] = 1;
              }
            }
          }
        }
      }
    } else {
      for (const tile of Object.values(tiles)) {
        if (
          tile.getOccupant() !== zeroAddress &&
          tile.getOccupant() !== walletAddress
        ) {
          const searchRange = GameConfig.enemyBuildingSearchRange;
          for (let x = -searchRange; x <= searchRange; x++) {
            for (let y = -searchRange; y <= searchRange; y++) {
              const tileX = tile.getTileX() + x;
              const tileY = tile.getTileY() + y;
              const localX = tileX - tileRange.startX;
              const localY = tileY - tileRange.startY;

              if (
                localY >= 0 && localY < height && localX >= 0 && localX < width
              ) {
                map[localY][localX] = 2;
              }
            }
          }
        }
      }
    }

    console.log(map);
  }
}

export default new BuildableArea();
