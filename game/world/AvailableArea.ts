import { WalletLoginManager } from "@common-module/wallet-login";
import { GameObject } from "@gaiaengine/2d";
import { zeroAddress } from "viem";
import BattlegroundContract from "../contracts/core/BattlegroundContract.js";
import GameConfig from "../core/GameConfig.js";
import BuildingManager from "../data/building/BuildingManager.js";
import AvailableTileOverlay from "./tile-overlays/AvailableTileOverlay.js";
import UnavailableTileOverlay from "./tile-overlays/UnavailableTileOverlay.js";
import Tile from "./Tile.js";

class AvailableArea extends GameObject {
  private map: { [key: string]: number } = {};
  private overlays: { [key: string]: GameObject } = {};

  constructor() {
    super(0, 0);
  }

  public async updateBuildableArea(tiles: { [key: string]: Tile }) {
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

      for (const tile of Object.values(tiles)) {
        if (tile.getOccupant() === zeroAddress) {
          this.map[`${tile.getTileX()},${tile.getTileY()}`] = 1;
        }
      }
    }

    for (const key in this.map) {
      const mapValue = this.map[key];
      const existingOverlay = this.overlays[key];

      if (!existingOverlay) {
        const overlay = this.createOverlay(key, mapValue);
        if (overlay) this.overlays[key] = overlay;
        continue;
      }

      const isBuildableOverlay = existingOverlay instanceof
        AvailableTileOverlay;
      if (
        (mapValue === 1 && !isBuildableOverlay) ||
        (mapValue === 2 && isBuildableOverlay)
      ) {
        existingOverlay.remove();
        const overlay = this.createOverlay(key, mapValue);
        if (overlay) this.overlays[key] = overlay;
      }
    }

    for (const key in this.overlays) {
      if (!this.map[key]) {
        this.overlays[key].remove();
        delete this.overlays[key];
      }
    }
  }

  private createOverlay(key: string, mapValue: number): GameObject | undefined {
    const [tileX, tileY] = key.split(",").map((val) => parseInt(val, 10));
    let overlay: GameObject | undefined;

    if (mapValue === 1) {
      overlay = new AvailableTileOverlay(tileX, tileY);
    } else if (mapValue === 2) {
      overlay = new UnavailableTileOverlay(tileX, tileY);
    }

    if (overlay) this.append(overlay);
    return overlay;
  }

  public clearAll() {
    this.clear();
    this.overlays = {};
    this.map = {};
  }
}

export default new AvailableArea();
