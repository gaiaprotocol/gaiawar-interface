import { ConfirmDialog } from "@common-module/app-components";
import { ErrorIcon } from "@gaiaprotocol/svg-icons";
import { TradeMaterialModal } from "gaiaprotocol";
import { formatEther } from "viem";
import ConstructionContract from "../contracts/commands/ConstructionContract.js";
import BuildingManager from "../data/building/BuildingManager.js";
import MaterialType from "../data/material/MaterialType.js";
import UserMaterialManager from "../data/material/UserMaterialManager.js";
import GameConfig from "../GameConfig.js";
import CommandBase from "./CommandBase.js";

class ConstructionCommand extends CommandBase {
  private async checkMaterials(buildingId: number) {
    const building = await BuildingManager.getBuilding(buildingId);
    await UserMaterialManager.reloadBalances();

    for (const [material, cost] of Object.entries(building.constructionCosts)) {
      if (UserMaterialManager.userMaterialBalances[material] < cost) {
        new ConfirmDialog({
          icon: new ErrorIcon(),
          title: "Insufficient Materials",
          message: `You need ${
            formatEther(cost)
          } ${material} to construct this building. Would you like to trade for more?`,
          onConfirm: () =>
            new TradeMaterialModal(
              GameConfig.getMaterialAddress(material as MaterialType),
            ),
        });
        return false;
      }
    }
    return true;
  }

  public async constructBuilding(
    x: number,
    y: number,
    buildingId: number,
  ): Promise<boolean> {
    if (!(await this.checkMaterials(buildingId))) return false;
    await ConstructionContract.constructBuilding(x, y, buildingId);
    await UserMaterialManager.reloadBalances();
    return true;
  }

  public async upgradeBuilding(
    x: number,
    y: number,
    buildingId: number,
  ): Promise<boolean> {
    if (!(await this.checkMaterials(buildingId))) return false;
    await ConstructionContract.upgradeBuilding(x, y, buildingId);
    await UserMaterialManager.reloadBalances();
    return true;
  }
}

export default new ConstructionCommand();
