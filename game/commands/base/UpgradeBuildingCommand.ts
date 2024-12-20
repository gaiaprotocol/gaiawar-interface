import { ConfirmDialog } from "@common-module/app-components";
import { ErrorIcon } from "@gaiaprotocol/svg-icons";
import { TradeMaterialModal } from "gaiaprotocol";
import { formatEther } from "viem";
import UpgradeBuildingContract from "../../contracts/commands/UpgradeBuildingContract.js";
import MaterialContractManager from "../../core/MaterialContractManager.js";
import BuildingManager from "../../data/building/BuildingManager.js";
import MaterialType from "../../data/material/MaterialType.js";
import UserMaterialManager from "../../data/material/UserMaterialManager.js";
import CommandBase from "./CommandBase.js";
import { Coordinates } from "@gaiaengine/2d";

class UpgradeBuildingCommand extends CommandBase {
  private async checkMaterials(buildingId: number) {
    const building = await BuildingManager.getBuilding(buildingId);
    await UserMaterialManager.reloadBalances();

    for (const [material, cost] of Object.entries(building.constructionCost)) {
      if (UserMaterialManager.userMaterialBalances[material] < cost) {
        new ConfirmDialog({
          icon: new ErrorIcon(),
          title: "Insufficient Materials",
          message: `You need ${
            formatEther(cost)
          } ${material} to construct this building. Would you like to trade for more?`,
          onConfirm: () =>
            new TradeMaterialModal(
              MaterialContractManager.getMaterialAddress(
                material as MaterialType,
              ),
            ),
        });
        return false;
      }
    }
    return true;
  }

  public async upgradeBuilding(
    coordinates: Coordinates,
    buildingId: number,
  ): Promise<boolean> {
    if (!(await this.checkMaterials(buildingId))) return false;
    await UpgradeBuildingContract.upgradeBuilding(coordinates, buildingId);
    await UserMaterialManager.reloadBalances();
    return true;
  }
}

export default new UpgradeBuildingCommand();
