import { WalletLoginManager } from "@common-module/wallet-login";
import { GameObject } from "@gaiaengine/2d";
import { zeroAddress } from "viem";
import BattlegroundContract from "../contracts/BattlegroundContract.js";
import BuildingManager from "../data/building/BuildingManager.js";
import GameConfig from "../GameConfig.js";
import BuildableTileOverlay from "./tile-overlays/BuildableTileOverlay.js";
import UnbuildableTileOverlay from "./tile-overlays/UnbuildableTileOverlay.js";
import Tile from "./Tile.js";

class BuildableArea extends GameObject {
  private map: { [key: string]: number } = {};
  private overlays: { [key: string]: GameObject } = {};

  constructor() {
    super(0, 0);
  }

  public async updateArea(tiles: { [key: string]: Tile }) {
    const walletAddress = WalletLoginManager.getLoggedInAddress();
    if (!walletAddress) return;

    const hasHeadquarters = await BattlegroundContract.hasHeadquarters(
      walletAddress,
    );

    this.map = {};

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
              const key = `${tileX},${tileY}`;
              this.map[key] = 1;
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
              const key = `${tileX},${tileY}`;
              this.map[key] = 2;
            }
          }
        }
      }
    }

    for (const key in this.map) {
      const mapValue = this.map[key];
      const existingOverlay = this.overlays[key];

      if (!existingOverlay) {
        this.overlays[key] = this.createOverlay(key, mapValue);
        continue;
      }

      const isBuildableOverlay = existingOverlay instanceof
        BuildableTileOverlay;
      if (
        (mapValue === 1 && !isBuildableOverlay) ||
        (mapValue === 2 && isBuildableOverlay)
      ) {
        existingOverlay.remove();
        this.overlays[key] = this.createOverlay(key, mapValue);
      }
    }

    for (const key in this.overlays) {
      if (!this.map[key]) {
        this.overlays[key].remove();
        delete this.overlays[key];
      }
    }
  }

  private createOverlay(key: string, mapValue: number): GameObject {
    const [tileX, tileY] = key.split(",").map((val) => parseInt(val, 10));
    let overlay: GameObject;

    if (mapValue === 1) {
      overlay = new BuildableTileOverlay(tileX, tileY);
    } else {
      overlay = new UnbuildableTileOverlay(tileX, tileY);
    }

    this.append(overlay);
    return overlay;
  }

  public clearAll() {
    this.clear();
    this.overlays = {};
    this.map = {};
  }
}

export default new BuildableArea();
