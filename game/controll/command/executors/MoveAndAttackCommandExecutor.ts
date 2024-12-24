import { Coordinates } from "@gaiaengine/2d";
import MoveAndAttackContract from "../../../contracts/commands/MoveAndAttackContract.js";
import { UnitQuantity } from "../../../data/tile/TileData.js";
import BaseCommandExecutor from "./base/BaseCommandExecutor.js";

class MoveAndAttackCommandExecutor extends BaseCommandExecutor {
  public async execute(
    from: Coordinates,
    to: Coordinates,
    units: UnitQuantity[],
  ) {
    await MoveAndAttackContract.moveAndAttack(from, to, units);
  }
}

export default new MoveAndAttackCommandExecutor();
