import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import MoveAndAttackContract from "../contracts/commands/MoveAndAttackContract.js";
import { UnitQuantity } from "../data/tile/TileData.js";
import PendingCommand, { PendingCommandType } from "../data/pending-command/PendingCommand.js";
import PendingCommandManager from "../data/pending-command/PendingCommandManager.js";
import BaseCommandExecutor from "./base/BaseCommandExecutor.js";

class MoveAndAttackCommandExecutor extends BaseCommandExecutor {
  public async execute(
    from: Coordinates,
    to: Coordinates,
    units: UnitQuantity[],
  ) {
    const user = WalletLoginManager.getLoggedInAddress();
    if (!user) return;

    const pendingCommand: PendingCommand = {
      type: PendingCommandType.MOVE_AND_ATTACK,
      user,
      from,
      to,
      units,
    };
    PendingCommandManager.addPendingCommand(pendingCommand);

    try {
      await MoveAndAttackContract.moveAndAttack(from, to, units);
    } catch (e) {
      console.error(e);
    }

    PendingCommandManager.removePendingCommand(pendingCommand);
  }
}

export default new MoveAndAttackCommandExecutor();
