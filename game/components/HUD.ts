import { DomNode } from "@common-module/app";
import { WalletLoginManager } from "@common-module/wallet-login";
import { LoggedInUserAvatarButton } from "@common-module/social-components";

export default class HUD extends DomNode {
  constructor() {
    super(".hud");
    this.append(
      "HUD",
      new LoggedInUserAvatarButton(WalletLoginManager),
    );
  }
}
