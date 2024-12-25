import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import UpgradeUnitContract from "../contracts/commands/UpgradeUnitContract.js";
import UserMaterialManager from "../data/material/UserMaterialManager.js";
import PendingCommand, {
  PendingCommandType,
} from "../data/pending-command/PendingCommand.js";
import PendingCommandManager from "../data/pending-command/PendingCommandManager.js";
import { UnitQuantity } from "../data/tile/TileData.js";
import UnitManager from "../data/unit/UnitManager.js";
import BaseCommandExecutor from "./base/BaseCommandExecutor.js";

class UpgradeUnitCommandExecutor extends BaseCommandExecutor {
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
        type: PendingCommandType.UPGRADE_UNIT,
        user,
        to: coordinates,
        units: [unitQuantity],
      };
      PendingCommandManager.addPendingCommand(pendingCommand);

      try {
        await UpgradeUnitContract.upgradeUnit(coordinates, unitQuantity);
      } catch (e) {
        console.error(e);
      }

      PendingCommandManager.removePendingCommand(pendingCommand);
      await UserMaterialManager.reloadBalances();
    }
  }
}

export default new UpgradeUnitCommandExecutor();
