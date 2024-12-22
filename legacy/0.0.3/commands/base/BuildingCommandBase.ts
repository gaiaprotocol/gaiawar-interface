import BuildingManager from "../../data/building/BuildingManager.js";
import CommandBase from "./CommandBase.js";

export default abstract class BuildingCommandBase extends CommandBase {
  protected async hasConstructionCost(buildingId: number) {
    const building = await BuildingManager.getBuilding(buildingId);
    return await this.hasCost(building.constructionCost);
  }
}
