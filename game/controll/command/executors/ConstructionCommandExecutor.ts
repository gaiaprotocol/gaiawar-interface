import { Coordinates } from "@gaiaengine/2d";
import ConstructContract from "../../../contracts/commands/ConstructContract.js";
import UserMaterialManager from "../../../data/material/UserMaterialManager.js";
import BuildingCommandExecutor from "./base/BuildingCommandExecutor.js";

class ConstructionCommandExecutor extends BuildingCommandExecutor {
  public async execute(
    coordinates: Coordinates,
    buildingId: number,
  ): Promise<boolean> {
    if (!(await this.checkUserHasConstructionCost(buildingId))) return false;
    await ConstructContract.construct(coordinates, buildingId);
    await UserMaterialManager.reloadBalances();
    return true;
  }
}

export default new ConstructionCommandExecutor();
