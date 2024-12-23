import BuildingManager from "../../../../data/building/BuildingManager.js";
import BaseCommandExecutor from "./BaseCommandExecutor.js";

export default abstract class BuildingCommandExecutor
  extends BaseCommandExecutor {
  protected async checkUserHasConstructionCost(buildingId: number) {
    const building = await BuildingManager.getBuilding(buildingId);
    return await this.checkUserHasCost(building.constructionCost);
  }
}
