import { BodyNode, el, View } from "@common-module/app";
import { WalletLoginManager } from "@common-module/wallet-login";
import { BackgroundMusic } from "@gaiaengine/2d";
import HUD from "../ui/HUD.js";
import Intro from "../ui/Intro.js";
import { IntegerUtils } from "@common-module/ts";

export default class GameView extends View {
  private bgm: BackgroundMusic | undefined;

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
    this.bgm?.remove();

    const bgmFilename = WalletLoginManager.isLoggedIn()
      ? `world${IntegerUtils.random(1, 2)}`
      : "intro";

    this.bgm = new BackgroundMusic({
      ogg: `assets/bgm/${bgmFilename}.ogg`,
      mp3: `assets/bgm/${bgmFilename}.mp3`,
    }).play();

    this.container.clear().append(
      WalletLoginManager.isLoggedIn() ? new HUD() : new Intro(),
    );
  }

  public close(): void {
    this.bgm?.remove();
    super.close();
  }
}
