import { Coordinates } from "@gaiaengine/2d";
import MoveContract from "../../../contracts/commands/MoveContract.js";
import { UnitQuantity } from "../../../data/tile/TileData.js";
import PendingCommand, { PendingCommandType } from "../PendingCommand.js";
import PendingCommandManager from "../PendingCommandManager.js";
import BaseCommandExecutor from "./base/BaseCommandExecutor.js";

class MoveCommandExecutor extends BaseCommandExecutor {
  public async execute(
    from: Coordinates,
    to: Coordinates,
    units: UnitQuantity[],
  ) {
    const pendingCommand: PendingCommand = {
      type: PendingCommandType.MOVE,
      from,
      to,
      units,
    };
    PendingCommandManager.addPendingCommand(pendingCommand);

    try {
      await MoveContract.move(from, to, units);
    } catch (e) {
      console.error(e);
    }

    PendingCommandManager.removePendingCommand(pendingCommand);
  }
}

export default new MoveCommandExecutor();
