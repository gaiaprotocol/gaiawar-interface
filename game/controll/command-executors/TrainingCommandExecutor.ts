import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import TrainContract from "../../contracts/commands/TrainContract.js";
import UserMaterialManager from "../../data/material/UserMaterialManager.js";
import { UnitQuantity } from "../../data/tile/TileData.js";
import UnitManager from "../../data/unit/UnitManager.js";
import PendingCommand, { PendingCommandType } from "../../data/pending-command/PendingCommand.js";
import PendingCommandManager from "../../data/pending-command/PendingCommandManager.js";
import BaseCommandExecutor from "./base/BaseCommandExecutor.js";

class TrainingCommandExecutor extends BaseCommandExecutor {
  public async execute(
    coordinates: Coordinates,
    unitQuantity: UnitQuantity,
  ) {
    const user = WalletLoginManager.getLoggedInAddress();
    if (!user) return;

    const unit = await UnitManager.getUnit(unitQuantity.unitId);
    const totalCost: { [material: string]: bigint } = unit.trainingCost;
    for (const [material, amount] of Object.entries(totalCost)) {
      totalCost[material] = amount * BigInt(unitQuantity.quantity);
    }

    if (await this.checkUserHasCost(totalCost)) {
      const pendingCommand: PendingCommand = {
        type: PendingCommandType.TRAIN,
        user,
        to: coordinates,
        units: [unitQuantity],
      };
      PendingCommandManager.addPendingCommand(pendingCommand);

      try {
        await TrainContract.train(coordinates, unitQuantity);
      } catch (e) {
        console.error(e);
      }

      PendingCommandManager.removePendingCommand(pendingCommand);
      await UserMaterialManager.reloadBalances();
    }
  }
}

export default new TrainingCommandExecutor();
