import { DomNode, el } from "@common-module/app";
import { Button, ButtonType } from "@common-module/app-components";
import { WalletLoginManager } from "@common-module/wallet-login";

export default class Intro extends DomNode {
  constructor() {
    super(".intro");
    this.append(
      el("h1", "Gaia War"),
      new Button({
        type: ButtonType.Contained,
        title: "Login with Wallet",
        onClick: () => WalletLoginManager.login("Login to play the game"),
      }),
    );
  }
}
