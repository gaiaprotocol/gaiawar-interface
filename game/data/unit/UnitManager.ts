import { ObjectUtils } from "@common-module/ts";
import UnitManagerContract from "../../contracts/data/UnitManagerContract.js";
import archerSkeletonData from "./spine-skeleton-data/archer.json" with {
  type: "json",
};
import axeWarriorSkeletonData from "./spine-skeleton-data/axe-warrior.json" with {
  type: "json",
};
import ballistaSkeletonData from "./spine-skeleton-data/ballista.json" with {
  type: "json",
};
import camelRiderSkeletonData from "./spine-skeleton-data/camel-rider.json" with {
  type: "json",
};
import catapultSkeletonData from "./spine-skeleton-data/catapult.json" with {
  type: "json",
};
import cavalrySkeletonData from "./spine-skeleton-data/cavalry.json" with {
  type: "json",
};
import crossbowmanSkeletonData from "./spine-skeleton-data/crossbowman.json" with {
  type: "json",
};
import knightSkeletonData from "./spine-skeleton-data/knight.json" with {
  type: "json",
};
import scoutSkeletonData from "./spine-skeleton-data/scout.json" with {
  type: "json",
};
import shieldBearerSkeletonData from "./spine-skeleton-data/shield-bearer.json" with {
  type: "json",
};
import spearmanSkeletonData from "./spine-skeleton-data/spearman.json" with {
  type: "json",
};
import swordsmanSkeletonData from "./spine-skeleton-data/swordsman.json" with {
  type: "json",
};
import warElephantSkeletonData from "./spine-skeleton-data/war-elephant.json" with {
  type: "json",
};
import UnitData, { UnitMetadata } from "./UnitData.js";
import unitMetadataSet from "./units-metadata.json" with {
  type: "json",
};

const SKELETON_DATA_MAP: Record<string, any> = {
  "knight": knightSkeletonData,
  "swordsman": swordsmanSkeletonData,
  "archer": archerSkeletonData,
  "cavalry": cavalrySkeletonData,
  "axe-warrior": axeWarriorSkeletonData,
  "spearman": spearmanSkeletonData,
  "shield-bearer": shieldBearerSkeletonData,
  "scout": scoutSkeletonData,
  "crossbowman": crossbowmanSkeletonData,
  "ballista": ballistaSkeletonData,
  "catapult": catapultSkeletonData,
  "camel-rider": camelRiderSkeletonData,
  "war-elephant": warElephantSkeletonData,
};

type NormalizedUnit = Omit<UnitData, "trainingCosts"> & {
  trainingCosts: {
    [material: string]: string;
  };
};

class UnitManager {
  private unitCache = new Map<number, NormalizedUnit>();
  private pendingRequests = new Map<number, Promise<UnitData>>();

  private normalizeUnit(unit: UnitData): NormalizedUnit {
    return {
      ...unit,
      trainingCosts: Object.fromEntries(
        Object.entries(unit.trainingCost).map((
          [key, value],
        ) => [key, value.toString()]),
      ),
    };
  }

  private denormalizeUnit(unit: NormalizedUnit): UnitData {
    return {
      ...unit,
      trainingCost: Object.fromEntries(
        Object.entries(unit.trainingCosts).map((
          [key, value],
        ) => [key, BigInt(value)]),
      ),
    };
  }

  public setUnit(unit: UnitData) {
    const normalizedUnit = this.normalizeUnit(unit);
    const cachedUnit = this.unitCache.get(unit.id);

    if (!ObjectUtils.isEqual(cachedUnit, normalizedUnit)) {
      this.unitCache.set(unit.id, normalizedUnit);
    }
  }

  public async getUnit(unitId: number): Promise<UnitData> {
    const cachedUnit = this.unitCache.get(unitId);
    if (cachedUnit) return this.denormalizeUnit(cachedUnit);

    const pendingRequest = this.pendingRequests.get(unitId);
    if (pendingRequest) return pendingRequest;

    const [unitInfo, trainingBuildingIds, trainingCosts] = await Promise.all([
      await UnitManagerContract.getUnit(unitId),
      await UnitManagerContract.getTrainingBuildingIds(unitId),
      await UnitManagerContract.getTrainingCost(unitId),
    ]);

    const metadata = unitMetadataSet.find((metadata) => metadata.id === unitId);
    const unit: UnitData = {
      ...(metadata
        ? {
          ...metadata,
          spine: {
            atlas: metadata.spine.atlas,
            skeletonData: SKELETON_DATA_MAP[unitId] ?? {},
            texture: metadata.spine.texture,
          },
        }
        : {
          id: unitId,
          key: `unit-${unitId}`,
          name: `Unit ${unitId}`,
          description: `Description of unit ${unitId}`,
          spine: { atlas: "", skeletonData: {}, texture: "" },
        }),
      ...unitInfo,
      trainingBuildingIds,
      trainingCost: trainingCosts,
    };
    this.setUnit(unit);
    return unit;
  }

  public async loadAllUnits(): Promise<UnitData[]> {
    return await Promise.all(
      unitMetadataSet.map((metadata) => this.getUnit(metadata.id)),
    );
  }

  public getUnitMetadata(unitId: number): UnitMetadata | undefined {
    const metadata = unitMetadataSet.find((metadata) => metadata.id === unitId);
    if (metadata) {
      return {
        ...metadata,
        spine: {
          atlas: metadata.spine.atlas,
          skeletonData: SKELETON_DATA_MAP[unitId] ?? {},
          texture: metadata.spine.texture,
        },
      };
    }
  }

  public async getTrainingBuildingUnits(
    buildingId: number,
  ): Promise<UnitData[]> {
    const units = await this.loadAllUnits();
    return units.filter((unit) =>
      unit.trainingBuildingIds.includes(buildingId)
    );
  }

  public canBeUpgraded(unitId: number) {
    const metadata = unitMetadataSet.find((metadata) => metadata.id === unitId);
    return metadata?.canBeUpgraded ?? false;
  }
}

export default new UnitManager();
