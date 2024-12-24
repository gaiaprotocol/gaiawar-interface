import { Coordinates } from "@gaiaengine/2d";
import TrainContract from "../../../contracts/commands/TrainContract.js";
import UserMaterialManager from "../../../data/material/UserMaterialManager.js";
import { UnitQuantity } from "../../../data/tile/TileData.js";
import UnitManager from "../../../data/unit/UnitManager.js";
import BaseCommandExecutor from "./base/BaseCommandExecutor.js";

class TrainingCommandExecutor extends BaseCommandExecutor {
  public async execute(
    coordinates: Coordinates,
    unitQuantity: UnitQuantity,
  ) {
    const unit = await UnitManager.getUnit(unitQuantity.unitId);
    const totalCost: { [material: string]: bigint } = unit.trainingCost;
    for (const [material, amount] of Object.entries(totalCost)) {
      totalCost[material] = amount * BigInt(unitQuantity.quantity);
    }
    if (await this.checkUserHasCost(totalCost)) {
      await TrainContract.train(coordinates, unitQuantity);
      await UserMaterialManager.reloadBalances();
    }
  }
}

export default new TrainingCommandExecutor();
