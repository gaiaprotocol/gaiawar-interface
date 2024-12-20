import TrainContract from "../contracts/commands/TrainContract.js";
import UserMaterialManager from "../data/material/UserMaterialManager.js";
import UnitCommandBase from "./base/UnitCommandBase.js";

class TrainingCommand extends UnitCommandBase {
  public async trainUnits(
    x: number,
    y: number,
    unitId: number,
    quantity: number,
  ) {
    if (!(await this.hasTrainingCost(unitId, quantity))) return false;
    await TrainContract.trainUnits(x, y, unitId, quantity);
    await UserMaterialManager.reloadBalances();
    return true;
  }
}

export default new TrainingCommand();
