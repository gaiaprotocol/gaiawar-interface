import { DomNode, el } from "@common-module/app";
import {
  AppCompConfig,
  Button,
  ButtonType,
} from "@common-module/app-components";
import { StringUtils } from "@common-module/ts";
import { WalletLoginManager } from "@common-module/wallet-login";
import { AddIcon } from "@gaiaprotocol/svg-icons";
import { TradeMaterialModal } from "gaiaprotocol";
import { formatEther } from "viem";
import GameConfig from "../GameConfig.js";
import materialIcons from "./materialIcons.js";
import MaterialType from "./MaterialType.js";

export default class UserMaterialListItem extends DomNode {
  constructor(private type: MaterialType) {
    super(".user-material-list-item");
    this.loadBalance();
  }

  private async loadBalance() {
    this.clear().append(el("img.icon", { src: materialIcons[this.type] }));

    const account = WalletLoginManager.getLoggedInAddress();
    if (account) {
      const loadingSpinner = new AppCompConfig.LoadingSpinner().appendTo(this);
      const balance = await GameConfig.materialContracts[this.type].balanceOf(
        account,
      );
      this.append(
        el(
          ".balance",
          StringUtils.formatNumberWithCommas(formatEther(balance)),
        ),
        new Button(".buy", {
          type: ButtonType.Circle,
          icon: new AddIcon(),
          onClick: () => {
            const modal = new TradeMaterialModal(
              GameConfig.getMaterialAddress(this.type),
            );
            modal.on("traded", () => this.loadBalance());
          },
        }),
      );
      loadingSpinner.remove();
    }
  }
}
