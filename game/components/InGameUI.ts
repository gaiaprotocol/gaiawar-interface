import { DomNode } from "@common-module/app";
import { Button, ButtonType } from "@common-module/app-components";
import { WalletLoginManager } from "@common-module/wallet-login";

export default class InGameUI extends DomNode {
  constructor() {
    super(".in-game-ui");
    this.append(
      new Button({
        type: ButtonType.Contained,
        title: "Logout",
        onClick: () => WalletLoginManager.logout(),
      }),
    );
  }
}
