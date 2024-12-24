import { Coordinates } from "@gaiaengine/2d";
import { UnitQuantity } from "../../data/tile/TileData.js";

export enum PendingCommandType {
  CONSTRUCT,
  UPGRADE_BUILDING,
  TRAIN,
  UPGRADE_UNIT,
  MOVE,
  MOVE_AND_ATTACK,
  RANGED_ATTACK,
  COLLECT_LOOT,
}

export default interface PendingCommand {
  type: PendingCommandType;
  from?: Coordinates;
  to: Coordinates;
  buildingId?: number;
  units?: UnitQuantity[];
}
