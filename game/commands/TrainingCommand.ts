import { Coordinates } from "@gaiaengine/2d";
import TrainContract from "../contracts/commands/TrainContract.js";
import UserMaterialManager from "../data/material/UserMaterialManager.js";
import UnitCommandBase from "./base/UnitCommandBase.js";

class TrainingCommand extends UnitCommandBase {
  public async trainUnits(
    coordinates: Coordinates,
    unitId: number,
    quantity: number,
  ) {
    if (!(await this.hasTrainingCost(unitId, quantity))) return false;
    await TrainContract.trainUnits(coordinates, unitId, quantity);
    await UserMaterialManager.reloadBalances();
    return true;
  }
}

export default new TrainingCommand();
