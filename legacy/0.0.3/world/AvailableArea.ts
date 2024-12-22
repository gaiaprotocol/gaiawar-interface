import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates, GameObject } from "@gaiaengine/2d";
import { zeroAddress } from "viem";
import BattlegroundContract from "../contracts/core/BattlegroundContract.js";
import GameConfig from "../config/GaiaWarConfig.js";
import BuildingManager from "../data/building/BuildingManager.js";
import { UnitQuantity } from "../data/TileData.js";
import UnitManager from "../data/unit/UnitManager.js";
import AvailableTileOverlay from "./tile-overlays/AvailableTileOverlay.js";
import UnavailableTileOverlay from "./tile-overlays/UnavailableTileOverlay.js";
import Tile from "./Tile.js";

class AvailableArea extends GameObject {
  private map: { [key: string]: number } = {};
  private overlays: { [key: string]: GameObject } = {};

  constructor() {
    super(0, 0);
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

  private updateOverlays() {
    for (const key in this.map) {
      const mapValue = this.map[key];
      const existingOverlay = this.overlays[key];

      if (!existingOverlay) {
        const overlay = this.createOverlay(key, mapValue);
        if (overlay) this.overlays[key] = overlay;
        continue;
      }

      const isAvailableOverlay = existingOverlay instanceof
        AvailableTileOverlay;
      if (
        (mapValue === 1 && !isAvailableOverlay) ||
        (mapValue === 2 && isAvailableOverlay)
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

  public async updateConstructableArea(tiles: { [key: string]: Tile }) {
    const walletAddress = WalletLoginManager.getLoggedInAddress();
    if (!walletAddress) return;

    const hasHeadquarters = await BattlegroundContract.hasHeadquarters(
      walletAddress,
    );

    this.map = {};

    if (hasHeadquarters) {
      for (const tile of Object.values(tiles)) {
        if (tile.getOccupant() === walletAddress) {
          const building = await BuildingManager.getBuilding(
            tile.getBuildingId(),
          );

          for (
            let dx = -building.constructionRange;
            dx <= building.constructionRange;
            dx++
          ) {
            const remainingRange = building.constructionRange - Math.abs(dx);
            for (let dy = -remainingRange; dy <= remainingRange; dy++) {
              const tileX = tile.getTileX() + dx;
              const tileY = tile.getTileY() + dy;
              const key = `${tileX},${tileY}`;

              const thisTile = tiles[key];
              if (thisTile) {
                if (
                  thisTile.getOccupant() === zeroAddress ||
                  thisTile.getOccupant() === walletAddress
                ) {
                  this.map[key] = 1;
                } else {
                  this.map[key] = 2;
                }
              }
            }
          }
        }
      }
    } else {
      for (const tile of Object.values(tiles)) {
        if (tile.getOccupant() === zeroAddress) {
          this.map[`${tile.getTileX()},${tile.getTileY()}`] = 1;
        }
      }

      for (const tile of Object.values(tiles)) {
        if (
          tile.getOccupant() !== zeroAddress &&
          tile.getOccupant() !== walletAddress
        ) {
          const searchRange = GameConfig.enemyBuildingSearchRange;

          for (let dx = -searchRange; dx <= searchRange; dx++) {
            const remainingRange = searchRange - Math.abs(dx);
            for (let dy = -remainingRange; dy <= remainingRange; dy++) {
              const tileX = tile.getTileX() + dx;
              const tileY = tile.getTileY() + dy;
              const key = `${tileX},${tileY}`;
              this.map[key] = 2;
            }
          }
        }
      }
    }

    this.updateOverlays();
  }

  public async updateMovableArea(
    unitTileCoord: Coordinates,
    _units: UnitQuantity[],
    tiles: { [key: string]: Tile },
  ) {
    const walletAddress = WalletLoginManager.getLoggedInAddress();
    if (!walletAddress) return;

    this.map = {};

    const unitTile = tiles[`${unitTileCoord.x},${unitTileCoord.y}`];
    if (!unitTile) return;

    const units = await Promise.all(
      _units.map((unit) => UnitManager.getUnit(unit.unitId)),
    );
    const minMovementRange = Math.min(
      ...units.map((unit) => unit.movementRange),
    );

    if (
      unitTile.getOccupant() === zeroAddress ||
      unitTile.getOccupant() === walletAddress
    ) {
      for (let dx = -minMovementRange; dx <= minMovementRange; dx++) {
        const remainingRange = minMovementRange - Math.abs(dx);
        for (let dy = -remainingRange; dy <= remainingRange; dy++) {
          const tileX = unitTile.getTileX() + dx;
          const tileY = unitTile.getTileY() + dy;
          const key = `${tileX},${tileY}`;

          const tile = tiles[key];
          if (tile) {
            if (
              tile.getOccupant() === zeroAddress ||
              tile.getOccupant() === walletAddress
            ) {
              this.map[key] = 1;
            } else {
              this.map[key] = 2;
            }
          }
        }
      }
    }

    this.updateOverlays();
  }

  public async updateAttackableArea(
    unitTileCoord: Coordinates,
    _units: UnitQuantity[],
    tiles: { [key: string]: Tile },
  ) {
    const walletAddress = WalletLoginManager.getLoggedInAddress();
    if (!walletAddress) return;

    this.map = {};

    const unitTile = tiles[`${unitTileCoord.x},${unitTileCoord.y}`];
    if (!unitTile) return;

    const units = await Promise.all(
      _units.map((unit) => UnitManager.getUnit(unit.unitId)),
    );
    const minMovementRange = Math.min(
      ...units.map((unit) => unit.movementRange),
    );

    if (
      unitTile.getOccupant() === zeroAddress ||
      unitTile.getOccupant() === walletAddress
    ) {
      for (let dx = -minMovementRange; dx <= minMovementRange; dx++) {
        const remainingRange = minMovementRange - Math.abs(dx);
        for (let dy = -remainingRange; dy <= remainingRange; dy++) {
          const tileX = unitTile.getTileX() + dx;
          const tileY = unitTile.getTileY() + dy;
          const key = `${tileX},${tileY}`;

          const tile = tiles[key];
          if (tile) {
            if (
              tile.getOccupant() === zeroAddress ||
              tile.getOccupant() === walletAddress
            ) {
              this.map[key] = 2;
            } else {
              this.map[key] = 1;
            }
          }
        }
      }
    }

    this.updateOverlays();
  }

  public async updateRangedAttackableArea(
    unitTileCoord: Coordinates,
    _units: UnitQuantity[],
    tiles: { [key: string]: Tile },
  ) {
    const walletAddress = WalletLoginManager.getLoggedInAddress();
    if (!walletAddress) return;

    this.map = {};

    const unitTile = tiles[`${unitTileCoord.x},${unitTileCoord.y}`];
    if (!unitTile) return;

    const units = await Promise.all(
      _units.map((unit) => UnitManager.getUnit(unit.unitId)),
    );
    const minAttackRange = Math.min(
      ...units.map((unit) => unit.attackRange),
    );

    if (
      unitTile.getOccupant() === zeroAddress ||
      unitTile.getOccupant() === walletAddress
    ) {
      for (let dx = -minAttackRange; dx <= minAttackRange; dx++) {
        const remainingRange = minAttackRange - Math.abs(dx);
        for (let dy = -remainingRange; dy <= remainingRange; dy++) {
          const tileX = unitTile.getTileX() + dx;
          const tileY = unitTile.getTileY() + dy;
          const key = `${tileX},${tileY}`;

          const tile = tiles[key];
          if (tile) {
            if (
              tile.getOccupant() === zeroAddress ||
              tile.getOccupant() === walletAddress
            ) {
              this.map[key] = 2;
            } else {
              this.map[key] = 1;
            }
          }
        }
      }
    }

    this.updateOverlays();
  }

  public clearAll() {
    this.clear();
    this.overlays = {};
    this.map = {};
  }
}

export default new AvailableArea();
