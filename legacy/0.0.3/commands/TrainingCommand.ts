import { Coordinates } from "@gaiaengine/2d";
import TrainContract from "../contracts/commands/TrainContract.js";
import UserMaterialManager from "../data/material/UserMaterialManager.js";
import UnitCommandBase from "./base/UnitCommandBase.js";
import { UnitQuantity } from "../data/TileData.js";

class TrainingCommand extends UnitCommandBase {
  public async trainUnits(
    coordinates: Coordinates,
    unitQuantity: UnitQuantity,
  ) {
    if (!(await this.hasTrainingCost(unitQuantity))) return false;
    await TrainContract.train(coordinates, unitQuantity);
    await UserMaterialManager.reloadBalances();
    return true;
  }
}

export default new TrainingCommand();
