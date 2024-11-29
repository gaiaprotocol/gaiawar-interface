import { BodyNode, el, View } from "@common-module/app";
import { WalletLoginManager } from "@common-module/wallet-login";
import InGameUI from "../components/InGameUI.js";
import Intro from "../components/Intro.js";

export default class GameView extends View {
  constructor() {
    super();
    this.container = el(".game-view").appendTo(BodyNode);

    this.addViewManagedEvent(
      WalletLoginManager,
      "loginStatusChanged",
      () => this.createContent(),
    ).createContent();
  }

  private createContent() {
    this.container.empty().append(
      WalletLoginManager.isLoggedIn ? new InGameUI() : new Intro(),
    );
  }
}
