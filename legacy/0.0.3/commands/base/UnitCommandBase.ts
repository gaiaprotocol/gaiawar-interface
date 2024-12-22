import { UnitQuantity } from "../../data/TileData.js";
import UnitManager from "../../data/unit/UnitManager.js";
import CommandBase from "./CommandBase.js";

export default abstract class UnitCommandBase extends CommandBase {
  protected async hasTrainingCost(
    unitQuantity: UnitQuantity,
  ): Promise<boolean> {
    const unit = await UnitManager.getUnit(unitQuantity.unitId);
    const totalCost: { [material: string]: bigint } = unit.trainingCost;
    for (const [material, amount] of Object.entries(totalCost)) {
      totalCost[material] = amount * BigInt(unitQuantity.quantity);
    }
    return await this.hasCost(totalCost);
  }
}
