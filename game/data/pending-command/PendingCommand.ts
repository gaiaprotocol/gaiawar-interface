import { Coordinates } from "@gaiaengine/2d";
import { UnitQuantity } from "../tile/TileData.js";

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
  user: string;
  from?: Coordinates;
  to: Coordinates;
  buildingId?: number;
  units?: UnitQuantity[];
}
