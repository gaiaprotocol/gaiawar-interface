import { BodyNode, el, View } from "@common-module/app";
import { WalletLoginManager } from "@common-module/wallet-login";
import Intro from "../components/Intro.js";

export default class AppView extends View {
  private intro;

  constructor() {
    super();
    this.container = el(
      ".app-view",
      WalletLoginManager.isLoggedIn ? undefined : this.intro = new Intro(),
    ).appendTo(BodyNode);

    WalletLoginManager.on("loginStatusChanged", (loggedIn) => {
      if (loggedIn && this.intro) {
        this.intro.remove();
        this.intro = undefined;
      }
    });
  }
}
