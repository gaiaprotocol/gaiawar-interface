import { Coordinates } from "@gaiaengine/2d";
import ConstructContract from "../../../contracts/commands/ConstructContract.js";
import UserMaterialManager from "../../../data/material/UserMaterialManager.js";
import BuildingCommandExecutor from "./base/BuildingCommandExecutor.js";

class ConstructionCommandExecutor extends BuildingCommandExecutor {
  public async execute(
    coordinates: Coordinates,
    buildingId: number,
  ) {
    if (await this.checkUserHasConstructionCost(buildingId)) {
      await ConstructContract.construct(coordinates, buildingId);
      await UserMaterialManager.reloadBalances();
    }
  }
}

export default new ConstructionCommandExecutor();
