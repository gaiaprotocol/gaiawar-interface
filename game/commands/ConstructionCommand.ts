import { Coordinates } from "@gaiaengine/2d";
import ConstructContract from "../contracts/commands/ConstructContract.js";
import UserMaterialManager from "../data/material/UserMaterialManager.js";
import BuildingCommandBase from "./base/BuildingCommandBase.js";

class ConstructionCommand extends BuildingCommandBase {
  public async constructBuilding(
    coordinates: Coordinates,
    buildingId: number,
  ): Promise<boolean> {
    if (!(await this.hasConstructionCost(buildingId))) return false;
    await ConstructContract.constructBuilding(coordinates, buildingId);
    await UserMaterialManager.reloadBalances();
    return true;
  }
}

export default new ConstructionCommand();
