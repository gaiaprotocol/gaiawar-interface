import { BodyNode, el, View } from "@common-module/app";
import { WalletLoginManager } from "@common-module/wallet-login";
import HUD from "../components/HUD.js";
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
    this.container.clear().append(
      WalletLoginManager.isLoggedIn() ? new HUD() : new Intro(),
    );
  }
}
