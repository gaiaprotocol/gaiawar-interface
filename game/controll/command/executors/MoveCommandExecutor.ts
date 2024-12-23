import { Coordinates } from "@gaiaengine/2d";
import MoveContract from "../../../contracts/commands/MoveContract.js";
import { UnitQuantity } from "../../../data/tile/TileData.js";
import BaseCommandExecutor from "./base/BaseCommandExecutor.js";

class MoveCommandExecutor extends BaseCommandExecutor {
  public async execute(
    from: Coordinates,
    to: Coordinates,
    units: UnitQuantity[],
  ) {
    await MoveContract.move(from, to, units);
    return true;
  }
}

export default new MoveCommandExecutor();
