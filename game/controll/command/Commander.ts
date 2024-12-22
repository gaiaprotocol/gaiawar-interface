import { Coordinates } from "@gaiaengine/2d";
import { UnitQuantity } from "../../data/tile/TileData.js";

class Commander {
  private waitingCommand:
    | "construct"
    | "move"
    | "move-and-attack"
    | "ranged-attack"
    | undefined;
  private waitingBuilding: number | undefined;
  private waitingUnits: UnitQuantity[] | undefined;

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
    //TODO:
  }
}

export default new Commander();
