import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import ConstructContract from "../contracts/commands/ConstructContract.js";
import UserMaterialManager from "../data/material/UserMaterialManager.js";
import PendingCommand, { PendingCommandType } from "../data/pending-command/PendingCommand.js";
import PendingCommandManager from "../data/pending-command/PendingCommandManager.js";
import BuildingCommandExecutor from "./base/BuildingCommandExecutor.js";

class ConstructionCommandExecutor extends BuildingCommandExecutor {
  public async execute(
    coordinates: Coordinates,
    buildingId: number,
  ) {
    const user = WalletLoginManager.getLoggedInAddress();
    if (!user) return;

    if (await this.checkUserHasConstructionCost(buildingId)) {
      const pendingCommand: PendingCommand = {
        type: PendingCommandType.CONSTRUCT,
        user,
        to: coordinates,
        buildingId,
      };
      PendingCommandManager.addPendingCommand(pendingCommand);

      try {
        await ConstructContract.construct(coordinates, buildingId);
      } catch (e) {
        console.error(e);
      }

      PendingCommandManager.removePendingCommand(pendingCommand);
      await UserMaterialManager.reloadBalances();
    }
  }
}

export default new ConstructionCommandExecutor();
