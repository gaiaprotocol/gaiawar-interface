import { BodyNode, el, View } from "@common-module/app";
import { WalletLoginManager } from "@common-module/wallet-login";
import { BackgroundMusic } from "@gaiaengine/2d";
import GaiaWarController from "../controll/GaiaWarController.js";
import HUD from "../ui/HUD.js";
import Intro from "../ui/Intro.js";

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

    const bgmFilenames = WalletLoginManager.isLoggedIn()
      ? ["world1", "world2"]
      : ["intro"];

    this.bgm = new BackgroundMusic(bgmFilenames.map((filename) => ({
      ogg: `assets/bgm/${filename}.ogg`,
      mp3: `assets/bgm/${filename}.mp3`,
    }))).play();

    this.container.clear().append(
      WalletLoginManager.isLoggedIn() ? new HUD() : new Intro(),
    );

    GaiaWarController.clearTiles();
  }

  public close(): void {
    this.bgm?.remove();
    super.close();
  }
}
