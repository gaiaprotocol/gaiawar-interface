import { Coordinates } from "@gaiaengine/2d";
import { UnitQuantity } from "../../data/tile/TileData.js";
import ConstructionCommandExecutor from "./executors/ConstructionCommandExecutor.js";
import MoveAndAttackCommandExecutor from "./executors/MoveAndAttackCommandExecutor.js";
import MoveCommandExecutor from "./executors/MoveCommandExecutor.js";
import RangedAttackCommandExecutor from "./executors/RangedAttackCommandExecutor.js";

class TileCommander {
  private fromTilePosition: Coordinates | undefined;
  private waitingCommand:
    | "construct"
    | "move"
    | "move-and-attack"
    | "ranged-attack"
    | undefined;
  private waitingBuilding: number | undefined;
  private waitingUnits: UnitQuantity[] | undefined;

  public setFromTilePosition(coord: Coordinates) {
    this.fromTilePosition = coord;
  }

  public waitForBuildingCommand(command: "construct", building: number) {
    this.waitingCommand = command;
    this.waitingBuilding = building;
  }

  public waitForUnitCommand(
    command: "move" | "move-and-attack" | "ranged-attack",
    units: UnitQuantity[],
  ) {
    this.waitingCommand = command;
    this.waitingUnits = units;
  }

  public selectTile(coord: Coordinates) {
    if (this.waitingCommand === "construct") {
      ConstructionCommandExecutor.execute(coord, this.waitingBuilding!);
    } else if (this.waitingCommand === "move") {
      MoveCommandExecutor.execute(
        this.fromTilePosition!,
        coord,
        this.waitingUnits!,
      );
    } else if (this.waitingCommand === "move-and-attack") {
      MoveAndAttackCommandExecutor.execute(
        this.fromTilePosition!,
        coord,
        this.waitingUnits!,
      );
    } else if (this.waitingCommand === "ranged-attack") {
      RangedAttackCommandExecutor.execute(
        this.fromTilePosition!,
        coord,
        this.waitingUnits!,
      );
    }
  }
}

export default new TileCommander();
