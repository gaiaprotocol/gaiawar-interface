import { Coordinates } from "@gaiaengine/2d";
import RangedAttackContract from "../../../contracts/commands/RangedAttackContract.js";
import { UnitQuantity } from "../../../data/tile/TileData.js";
import BaseCommandExecutor from "./base/BaseCommandExecutor.js";

class RangedAttackCommandExecutor extends BaseCommandExecutor {
  public async execute(
    from: Coordinates,
    to: Coordinates,
    units: UnitQuantity[],
  ) {
    await RangedAttackContract.rangedAttack(from, to, units);
  }
}

export default new RangedAttackCommandExecutor();
