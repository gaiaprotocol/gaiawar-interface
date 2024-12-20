import UnitManager from "../../data/unit/UnitManager.js";
import CommandBase from "./CommandBase.js";

export default abstract class UnitCommandBase extends CommandBase {
  protected async hasTrainingCost(unitId: number, quantity: number) {
    const unit = await UnitManager.getUnit(unitId);
    const totalCost: { [material: string]: bigint } = unit.trainingCost;
    for (const [material, amount] of Object.entries(totalCost)) {
      totalCost[material] = amount * BigInt(quantity);
    }
    return await this.hasCost(totalCost);
  }
}
