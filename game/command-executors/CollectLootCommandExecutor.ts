import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import BattlegroundContract from "../contracts/core/BattlegroundContract.js";
import UserMaterialManager from "../data/material/UserMaterialManager.js";
import PendingCommand, {
  PendingCommandType,
} from "../data/pending-command/PendingCommand.js";
import PendingCommandManager from "../data/pending-command/PendingCommandManager.js";
import BuildingCommandExecutor from "./base/BuildingCommandExecutor.js";

class CollectLootCommandExecutor extends BuildingCommandExecutor {
  public async execute(coordinates: Coordinates) {
    const user = WalletLoginManager.getLoggedInAddress();
    if (!user) return;

    const pendingCommand: PendingCommand = {
      type: PendingCommandType.COLLECT_LOOT,
      user,
      to: coordinates,
    };
    PendingCommandManager.addPendingCommand(pendingCommand);

    try {
      await BattlegroundContract.collectLoot(coordinates);
    } catch (e) {
      console.error(e);
    }

    PendingCommandManager.removePendingCommand(pendingCommand);
    await UserMaterialManager.reloadBalances();
  }
}

export default new CollectLootCommandExecutor();
