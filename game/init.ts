import { Router, SPAInitializer } from "@common-module/app";
import { WalletLoginManager } from "@common-module/wallet-login";
import GameConfig, { IGameConfig } from "./GameConfig.js";
import GameView from "./views/GameView.js";
import WorldManager from "./world/WorldManager.js";

export default async function init(config: IGameConfig) {
  GameConfig.init(config);
  SPAInitializer.init();
  WalletLoginManager.init();

  WorldManager.init();

  Router.add("/", GameView);
}
