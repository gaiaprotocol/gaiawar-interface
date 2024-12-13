import { ObjectUtils } from "@common-module/ts";
import BuildingsContract from "../contracts/entities/BuildingsContract.js";
import buildingMetadataSet from "../metadata/buildings.json" assert {
  type: "json",
};
import Building from "./Building.js";

type NormalizedBuilding = Omit<Building, "constructionCosts"> & {
  constructionCosts: {
    [material: string]: string;
  };
};

class BuildingManager {
  private buildingCache = new Map<number, NormalizedBuilding>();
  private pendingRequests = new Map<number, Promise<Building>>();

  private normalizeBuilding(building: Building): NormalizedBuilding {
    return {
      ...building,
      constructionCosts: Object.fromEntries(
        Object.entries(building.constructionCosts).map((
          [key, value],
        ) => [key, value.toString()]),
      ),
    };
  }

  private denormalizeBuilding(building: NormalizedBuilding): Building {
    return {
      ...building,
      constructionCosts: Object.fromEntries(
        Object.entries(building.constructionCosts).map((
          [key, value],
        ) => [key, BigInt(value)]),
      ),
    };
  }

  public setBuilding(building: Building) {
    const normalizedBuilding = this.normalizeBuilding(building);
    const cachedBuilding = this.buildingCache.get(building.id);

    if (!ObjectUtils.isEqual(cachedBuilding, normalizedBuilding)) {
      this.buildingCache.set(building.id, normalizedBuilding);
    }
  }

  public async getBuilding(buildingId: number): Promise<Building | undefined> {
    const cachedBuilding = this.buildingCache.get(buildingId);
    if (cachedBuilding) return this.denormalizeBuilding(cachedBuilding);

    const pendingRequest = this.pendingRequests.get(buildingId);
    if (pendingRequest) return pendingRequest;

    const [buildingInfo, constructionCosts] = await Promise.all([
      await BuildingsContract.getBuilding(buildingId),
      await BuildingsContract.getConstructionCosts(buildingId),
    ]);

    const metadata = buildingMetadataSet.find((metadata) =>
      metadata.id === buildingId
    );
    const building: Building = {
      ...(metadata ? metadata : {
        id: buildingId,
        name: `Building ${buildingId}`,
        description: `Description of building ${buildingId}`,
        assets: {
          base: "",
        },
      }),
      ...buildingInfo,
      constructionCosts,
    };
    this.setBuilding(building);
    return building;
  }

  public async loadAllBuildings(): Promise<void> {
    const nextBuildingId = await BuildingsContract.getNextBuildingId();
    await Promise.all(
      Array.from(
        { length: nextBuildingId - 1 },
        (_, index) => this.getBuilding(index + 1),
      ),
    );
    console.log("All buildings loaded");
  }
}

export default new BuildingManager();
