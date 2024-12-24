import { Coordinates } from "@gaiaengine/2d";
import ConstructContract from "../../../contracts/commands/ConstructContract.js";
import UserMaterialManager from "../../../data/material/UserMaterialManager.js";
import PendingCommand, { PendingCommandType } from "../PendingCommand.js";
import PendingCommandManager from "../PendingCommandManager.js";
import BuildingCommandExecutor from "./base/BuildingCommandExecutor.js";

class ConstructionCommandExecutor extends BuildingCommandExecutor {
  public async execute(
    coordinates: Coordinates,
    buildingId: number,
  ) {
    if (await this.checkUserHasConstructionCost(buildingId)) {
      const pendingCommand: PendingCommand = {
        type: PendingCommandType.CONSTRUCT,
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
