import { Coordinates } from "@gaiaengine/2d";
import { UnitQuantity } from "../../data/tile/TileData.js";
import GaiaWarController from "../GaiaWarController.js";
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

  public async waitForBuildingCommand(command: "construct", building: number) {
    this.waitingCommand = command;
    this.waitingBuilding = building;

    await GaiaWarController.showConstructableArea(
      this.fromTilePosition!,
      building,
    );
  }

  public async waitForUnitCommand(
    command: "move" | "move-and-attack" | "ranged-attack",
    units: UnitQuantity[],
  ) {
    this.waitingCommand = command;
    this.waitingUnits = units;

    await GaiaWarController.showUnitActionableArea(
      this.fromTilePosition!,
      command,
      units,
    );
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

    this.fromTilePosition = coord;
  }

  public reset() {
    this.fromTilePosition = undefined;
    this.waitingCommand = undefined;
    this.waitingBuilding = undefined;
    this.waitingUnits = undefined;

    GaiaWarController.hideActionableArea();
  }
}

export default new TileCommander();
