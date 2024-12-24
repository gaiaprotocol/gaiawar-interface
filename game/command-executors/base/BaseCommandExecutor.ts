import { ConfirmDialog } from "@common-module/app-components";
import { ErrorIcon } from "@gaiaprotocol/svg-icons";
import { TradeMaterialModal } from "gaiaprotocol";
import { formatEther } from "viem";
import MaterialContractManager from "../../config/MaterialContractManager.js";
import MaterialType from "../../data/material/MaterialType.js";
import UserMaterialManager from "../../data/material/UserMaterialManager.js";

export default abstract class BaseCommandExecutor {
  protected async checkUserHasCost(cost: { [material: string]: bigint }) {
    await UserMaterialManager.reloadBalances();

    for (const [material, amount] of Object.entries(cost)) {
      if (UserMaterialManager.userMaterialBalances[material] < amount) {
        new ConfirmDialog({
          icon: new ErrorIcon(),
          title: "Insufficient Materials",
          message: `You need ${
            formatEther(amount)
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
}
