import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import { zeroAddress } from "viem";
import GaiaWarConfig from "../config/GaiaWarConfig.js";
import BattlegroundContract from "../contracts/core/BattlegroundContract.js";
import BuildingManager from "./building/BuildingManager.js";
import TileManager from "./tile/TileManager.js";
import UnitManager from "./unit/UnitManager.js";

enum TileAvailableValue {
  NONE,
  AVAILABLE,
  UNAVAILABLE,
}

type AreaMap = Record<number, Record<number, TileAvailableValue>>;

class ActionableAreaCalculator {
  private makeDefaultAreaMap(defaultValue: TileAvailableValue): AreaMap {
    const range = TileManager.getCurrentTileRange();
    const areaMap: AreaMap = {};

    for (let x = range.startX; x <= range.endX; x++) {
      areaMap[x] = {};
      for (let y = range.startY; y <= range.endY; y++) {
        areaMap[x][y] = defaultValue;
      }
    }

    return areaMap;
  }

  private fillAreaMap(
    areaMap: AreaMap,
    centerX: number,
    centerY: number,
    range: number,
    safeValue: TileAvailableValue,
    dangerValue: TileAvailableValue,
  ) {
    const user = WalletLoginManager.getLoggedInAddress();
    if (!user) return;

    for (let dx = -range; dx <= range; dx++) {
      const remainingRange = range - Math.abs(dx);
      for (let dy = -remainingRange; dy <= remainingRange; dy++) {
        const x = centerX + dx;
        const y = centerY + dy;
        const tileData = TileManager.getCurrentTileData(x, y);
        if (!tileData) continue;

        if (tileData.occupant === zeroAddress || tileData.occupant === user) {
          areaMap[x][y] = safeValue;
        } else {
          areaMap[x][y] = dangerValue;
        }
      }
    }
  }

  public async calculateConstructableArea(): Promise<AreaMap> {
    const user = WalletLoginManager.getLoggedInAddress();
    if (!user) return {};

    if (await BattlegroundContract.hasHeadquarters(user)) {
      const areaMap = this.makeDefaultAreaMap(TileAvailableValue.NONE);
      const range = TileManager.getCurrentTileRange();

      for (let x = range.startX; x <= range.endX; x++) {
        for (let y = range.startY; y <= range.endY; y++) {
          const tileData = TileManager.getCurrentTileData(x, y);
          if (tileData?.occupant === user) {
            const building = await BuildingManager.getBuilding(
              tileData.buildingId,
            );
            this.fillAreaMap(
              areaMap,
              x,
              y,
              building.constructionRange,
              TileAvailableValue.AVAILABLE,
              TileAvailableValue.UNAVAILABLE,
            );
          }
        }
      }

      return areaMap;
    } else {
      const areaMap = this.makeDefaultAreaMap(TileAvailableValue.AVAILABLE);
      const range = TileManager.getCurrentTileRange();

      for (let x = range.startX; x <= range.endX; x++) {
        for (let y = range.startY; y <= range.endY; y++) {
          const tileData = TileManager.getCurrentTileData(x, y);
          if (
            tileData &&
            tileData.occupant !== zeroAddress &&
            tileData.occupant !== user
          ) {
            this.fillAreaMap(
              areaMap,
              x,
              y,
              GaiaWarConfig.enemyBuildingSearchRange,
              TileAvailableValue.UNAVAILABLE,
              TileAvailableValue.UNAVAILABLE,
            );
          }
        }
      }

      return areaMap;
    }
  }

  public async calculateUnitActionableArea(
    unitAction: "move" | "move-and-attack" | "ranged-attack",
    unitTilePosition: Coordinates,
  ): Promise<AreaMap> {
    const user = WalletLoginManager.getLoggedInAddress();
    if (!user) return {};

    const unitTileData = TileManager.getCurrentTileData(
      unitTilePosition.x,
      unitTilePosition.y,
    );
    if (!unitTileData || unitTileData.occupant !== user) return {};

    const units = await Promise.all(
      unitTileData.units.map((u) => UnitManager.getUnit(u.unitId)),
    );

    const areaMap = this.makeDefaultAreaMap(TileAvailableValue.NONE);

    if (unitAction === "move" || unitAction === "move-and-attack") {
      const minRange = Math.min(
        ...units.map((unit) => unit.movementRange),
      );

      this.fillAreaMap(
        areaMap,
        unitTilePosition.x,
        unitTilePosition.y,
        minRange,
        unitAction === "move"
          ? TileAvailableValue.AVAILABLE
          : TileAvailableValue.UNAVAILABLE, // move-and-attack
        unitAction === "move"
          ? TileAvailableValue.UNAVAILABLE
          : TileAvailableValue.AVAILABLE, // move-and-attack
      );
    } else if (unitAction === "ranged-attack") {
      const minRange = Math.min(
        ...units.map((unit) => unit.attackRange),
      );

      this.fillAreaMap(
        areaMap,
        unitTilePosition.x,
        unitTilePosition.y,
        minRange,
        TileAvailableValue.UNAVAILABLE,
        TileAvailableValue.AVAILABLE,
      );
    }

    return areaMap;
  }
}

export default new ActionableAreaCalculator();
