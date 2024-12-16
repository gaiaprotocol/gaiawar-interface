import { ObjectUtils } from "@common-module/ts";
import UnitsContract from "../../contracts/entities/UnitsContract.js";
import UnitData from "./UnitData.js";
import unitMetadataSet from "./units-metadata.json" assert {
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
        Object.entries(unit.trainingCosts).map((
          [key, value],
        ) => [key, value.toString()]),
      ),
    };
  }

  private denormalizeUnit(unit: NormalizedUnit): UnitData {
    return {
      ...unit,
      trainingCosts: Object.fromEntries(
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

    const [unitInfo, trainingCosts] = await Promise.all([
      await UnitsContract.getUnit(unitId),
      await UnitsContract.getTrainingCosts(unitId),
    ]);

    const metadata = unitMetadataSet.find((metadata) => metadata.id === unitId);
    const unit: UnitData = {
      ...(metadata ? metadata : {
        id: unitId,
        name: `Unit ${unitId}`,
        description: `Description of unit ${unitId}`,
        spine: { atlas: "", json: "", png: "" },
      }),
      ...unitInfo,
      trainingCosts,
    };
    this.setUnit(unit);
    return unit;
  }

  public async loadAllUnits(): Promise<UnitData[]> {
    return await Promise.all(
      unitMetadataSet.map((metadata) => this.getUnit(metadata.id)),
    );
  }
}

export default new UnitManager();
