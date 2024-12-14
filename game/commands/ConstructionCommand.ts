import ConstructionContract from "../contracts/commands/ConstructionContract.js";
import CommandBase from "./CommandBase.js";

class ConstructionCommand extends CommandBase {
  public async constructBuilding(x: number, y: number, buildingId: number) {
    await ConstructionContract.constructBuilding(x, y, buildingId);
  }
}

export default new ConstructionCommand();
