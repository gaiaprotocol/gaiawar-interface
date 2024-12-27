import { ObjectUtils } from "@common-module/ts";
import UnitManagerContract from "../../contracts/data/UnitManagerContract.js";
import UnitData, { UnitMetadata } from "./UnitData.js";
import unitMetadataSet from "./units-metadata.json" with {
  type: "json",
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
      ...(metadata ? metadata : {
        id: unitId,
        key: `unit-${unitId}`,
        name: `Unit ${unitId}`,
        description: `Description of unit ${unitId}`,
        spine: { atlas: "", json: "", png: "" },
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
    return unitMetadataSet.find((metadata) => metadata.id === unitId);
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
