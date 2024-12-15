import { ObjectUtils } from "@common-module/ts";
import BuildingsContract from "../../contracts/entities/BuildingsContract.js";
import BuildingData from "./BuildingData.js";
import buildingMetadataSet from "./buildings-metadata.json" assert {
  type: "json",
};

type NormalizedBuilding = Omit<BuildingData, "constructionCosts"> & {
  constructionCosts: {
    [material: string]: string;
  };
};

class BuildingManager {
  private buildingCache = new Map<number, NormalizedBuilding>();
  private pendingRequests = new Map<number, Promise<BuildingData>>();

  private normalizeBuilding(building: BuildingData): NormalizedBuilding {
    return {
      ...building,
      constructionCosts: Object.fromEntries(
        Object.entries(building.constructionCosts).map((
          [key, value],
        ) => [key, value.toString()]),
      ),
    };
  }

  private denormalizeBuilding(building: NormalizedBuilding): BuildingData {
    return {
      ...building,
      constructionCosts: Object.fromEntries(
        Object.entries(building.constructionCosts).map((
          [key, value],
        ) => [key, BigInt(value)]),
      ),
    };
  }

  public setBuilding(building: BuildingData) {
    const normalizedBuilding = this.normalizeBuilding(building);
    const cachedBuilding = this.buildingCache.get(building.id);

    if (!ObjectUtils.isEqual(cachedBuilding, normalizedBuilding)) {
      this.buildingCache.set(building.id, normalizedBuilding);
    }
  }

  public async getBuilding(buildingId: number): Promise<BuildingData> {
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
    const building: BuildingData = {
      ...(metadata ? metadata : {
        id: buildingId,
        name: `Building ${buildingId}`,
        description: `Description of building ${buildingId}`,
        sprites: { base: "", player: "", enemy: "" },
      }),
      ...buildingInfo,
      constructionCosts,
    };
    this.setBuilding(building);
    return building;
  }

  public async loadAllBuildings(): Promise<BuildingData[]> {
    return await Promise.all(
      buildingMetadataSet.map((metadata) => this.getBuilding(metadata.id)),
    );
  }

  public getConstructionRange(buildingId: number) {
    const metadata = buildingMetadataSet.find((metadata) =>
      metadata.id === buildingId
    );
    return metadata?.constructionRange ?? 0;
  }
}

export default new BuildingManager();
