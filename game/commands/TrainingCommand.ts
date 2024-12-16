import { ConfirmDialog } from "@common-module/app-components";
import { ErrorIcon } from "@gaiaprotocol/svg-icons";
import { TradeMaterialModal } from "gaiaprotocol";
import { formatEther } from "viem";
import TrainingContract from "../contracts/commands/TrainingContract.js";
import MaterialType from "../data/material/MaterialType.js";
import UserMaterialManager from "../data/material/UserMaterialManager.js";
import UnitManager from "../data/unit/UnitManager.js";
import GameConfig from "../GameConfig.js";
import CommandBase from "./CommandBase.js";

class TrainingCommand extends CommandBase {
  private async checkMaterials(unitId: number, quantity: number) {
    const unit = await UnitManager.getUnit(unitId);
    await UserMaterialManager.reloadBalances();

    for (const [material, cost] of Object.entries(unit.trainingCosts)) {
      const totalCost: bigint = cost * BigInt(quantity);
      if (UserMaterialManager.userMaterialBalances[material] < totalCost) {
        new ConfirmDialog({
          icon: new ErrorIcon(),
          title: "Insufficient Materials",
          message: `You need ${
            formatEther(totalCost)
          } ${material} to train these units. Would you like to trade for more?`,
          onConfirm: () =>
            new TradeMaterialModal(
              GameConfig.getMaterialAddress(material as MaterialType),
            ),
        });
        return false;
      }
    }
    return true;
  }

  public async trainUnits(
    x: number,
    y: number,
    unitId: number,
    quantity: number,
  ) {
    if (!(await this.checkMaterials(unitId, quantity))) return false;
    await TrainingContract.trainUnits(x, y, unitId, quantity);
    await UserMaterialManager.reloadBalances();
    return true;
  }
}

export default new TrainingCommand();
