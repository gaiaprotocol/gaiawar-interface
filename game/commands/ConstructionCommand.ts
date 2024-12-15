import { ConfirmDialog } from "@common-module/app-components";
import { WalletLoginManager } from "@common-module/wallet-login";
import { ErrorIcon } from "@gaiaprotocol/svg-icons";
import { TradeMaterialModal } from "gaiaprotocol";
import { formatEther } from "viem";
import ConstructionContract from "../contracts/commands/ConstructionContract.js";
import BuildingManager from "../data/building/BuildingManager.js";
import MaterialType from "../data/material/MaterialType.js";
import GameConfig from "../GameConfig.js";
import CommandBase from "./CommandBase.js";

class ConstructionCommand extends CommandBase {
  public async constructBuilding(x: number, y: number, buildingId: number) {
    const walletAddress = WalletLoginManager.getLoggedInAddress();
    if (!walletAddress) throw new Error("Not logged in");

    const building = await BuildingManager.getBuilding(buildingId);
    const balances = await Promise.all(
      Object.keys(building.constructionCosts).map((material) =>
        GameConfig.getMaterialContract(material as MaterialType).balanceOf(
          walletAddress,
        )
      ),
    );

    for (
      const [index, [material, cost]] of Object.entries(
        building.constructionCosts,
      ).entries()
    ) {
      if (balances[index] < cost) {
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
        return;
      }
    }

    await ConstructionContract.constructBuilding(x, y, buildingId);
  }
}

export default new ConstructionCommand();
