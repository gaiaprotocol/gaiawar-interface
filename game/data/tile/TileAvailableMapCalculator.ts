import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import { zeroAddress } from "viem";
import GaiaWarConfig from "../../config/GaiaWarConfig.js";
import BattlegroundContract from "../../contracts/core/BattlegroundContract.js";
import BuildingManager from "../building/BuildingManager.js";
import UnitManager from "../unit/UnitManager.js";
import TileAvailableMap from "./TileAvailableMap.js";
import TileAvailableValue from "./TileAvailableValue.js";
import TileManager from "./TileManager.js";

class TileAvailableMapCalculator {
  private makeDefaultValueMap(
    defaultValue: TileAvailableValue,
  ): TileAvailableMap {
    const range = TileManager.getCurrentTileRange();
    const areaMap: TileAvailableMap = {};

    for (let x = range.startX; x <= range.endX; x++) {
      areaMap[x] = {};
      for (let y = range.startY; y <= range.endY; y++) {
        areaMap[x][y] = defaultValue;
      }
    }

    return areaMap;
  }

  private fill(
    areaMap: TileAvailableMap,
    centerX: number,
    centerY: number,
    range: number,
    getValue: (x: number, y: number) => TileAvailableValue,
  ) {
    for (let dx = -range; dx <= range; dx++) {
      const remainingRange = range - Math.abs(dx);
      for (let dy = -remainingRange; dy <= remainingRange; dy++) {
        const x = centerX + dx;
        const y = centerY + dy;
        areaMap[x][y] = getValue(x, y);
      }
    }
  }

  public async calculateConstructableArea(): Promise<TileAvailableMap> {
    const user = WalletLoginManager.getLoggedInAddress();
    if (!user) return {};

    if (await BattlegroundContract.hasHeadquarters(user)) {
      const areaMap = this.makeDefaultValueMap(TileAvailableValue.NONE);
      const range = TileManager.getCurrentTileRange();

      for (let x = range.startX; x <= range.endX; x++) {
        for (let y = range.startY; y <= range.endY; y++) {
          const tileData = TileManager.getCurrentTileData(x, y);
          if (tileData?.occupant === user && tileData.buildingId !== 0) {
            const building = await BuildingManager.getBuilding(
              tileData.buildingId,
            );
            this.fill(
              areaMap,
              x,
              y,
              building.constructionRange,
              (x, y) => {
                const tileData = TileManager.getCurrentTileData(x, y);
                if (!tileData) return TileAvailableValue.UNAVAILABLE;
                return tileData.occupant === zeroAddress ||
                    (tileData.occupant === user && tileData.buildingId === 0)
                  ? TileAvailableValue.AVAILABLE
                  : TileAvailableValue.UNAVAILABLE;
              },
            );
          }
        }
      }

      return areaMap;
    } else {
      const areaMap = this.makeDefaultValueMap(TileAvailableValue.AVAILABLE);
      const range = TileManager.getCurrentTileRange();

      for (let x = range.startX; x <= range.endX; x++) {
        for (let y = range.startY; y <= range.endY; y++) {
          const tileData = TileManager.getCurrentTileData(x, y);
          if (
            tileData &&
            tileData.occupant !== zeroAddress &&
            tileData.occupant !== user
          ) {
            this.fill(
              areaMap,
              x,
              y,
              tileData.buildingId !== 0
                ? GaiaWarConfig.enemyBuildingSearchRange
                : 1,
              () => TileAvailableValue.UNAVAILABLE,
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
  ): Promise<TileAvailableMap> {
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

    const areaMap = this.makeDefaultValueMap(TileAvailableValue.NONE);

    if (unitAction === "move" || unitAction === "move-and-attack") {
      const minRange = Math.min(
        ...units.map((unit) => unit.movementRange),
      );

      this.fill(
        areaMap,
        unitTilePosition.x,
        unitTilePosition.y,
        minRange,
        (x, y) => {
          const tileData = TileManager.getCurrentTileData(x, y);
          if (!tileData) return TileAvailableValue.UNAVAILABLE;

          return tileData.occupant === zeroAddress ||
              tileData.occupant === user
            ? (
              unitAction === "move"
                ? TileAvailableValue.AVAILABLE
                : TileAvailableValue.UNAVAILABLE // move-and-attack
            )
            : (
              unitAction === "move"
                ? TileAvailableValue.UNAVAILABLE
                : TileAvailableValue.AVAILABLE // move-and-attack
            );
        },
      );
    } else if (unitAction === "ranged-attack") {
      const minRange = Math.min(
        ...units.map((unit) => unit.attackRange),
      );

      this.fill(
        areaMap,
        unitTilePosition.x,
        unitTilePosition.y,
        minRange,
        (x, y) => {
          const tileData = TileManager.getCurrentTileData(x, y);
          if (!tileData) return TileAvailableValue.UNAVAILABLE;

          return tileData.occupant === zeroAddress ||
              tileData.occupant === user
            ? TileAvailableValue.UNAVAILABLE
            : TileAvailableValue.AVAILABLE;
        },
      );
    }

    return areaMap;
  }
}

export default new TileAvailableMapCalculator();
