import { DomNode, el } from "@common-module/app";
import { Button, ButtonType } from "@common-module/app-components";
import { AddIcon } from "@gaiaprotocol/svg-icons";
import { TradeMaterialModal } from "gaiaprotocol";
import { formatEther } from "viem";
import MaterialType from "../../data/material/MaterialType.js";
import UserMaterialManager from "../../data/material/UserMaterialManager.js";
import GameConfig from "../../GameConfig.js";
import materialIcons from "./materialIcons.js";

export default class UserMaterialListItem extends DomNode {
  private balanceDisplay: DomNode;

  constructor(private type: MaterialType) {
    super(".user-material-list-item");
    this.append(
      el("img.icon", { src: materialIcons[type] }),
      this.balanceDisplay = el("span.balance"),
      new Button(".buy", {
        type: ButtonType.Circle,
        icon: new AddIcon(),
        onClick: () => {
          const modal = new TradeMaterialModal(
            GameConfig.getMaterialAddress(type),
          );
          modal.on("traded", () => UserMaterialManager.reloadBalances());
        },
      }),
    );

    this.render();
    this.subscribe(
      UserMaterialManager,
      "balanceUpdated",
      (material) => {
        if (material === this.type) this.render();
      },
    );
  }

  private render() {
    this.balanceDisplay.text = formatEther(
      UserMaterialManager.userMaterialBalances[this.type],
    );
  }
}
