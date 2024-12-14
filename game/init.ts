import { Router, SPAInitializer } from "@common-module/app";
import { WalletLoginManager } from "@common-module/wallet-login";
import BuildingManager from "./data/building/BuildingManager.js";
import GameConfig, { IGameConfig } from "./GameConfig.js";
import GameView from "./views/GameView.js";

export default async function init(config: IGameConfig) {
  GameConfig.init(config);
  SPAInitializer.init();
  WalletLoginManager.init();

  BuildingManager.loadAllBuildings();
  //WorldManager.init();

  Router.add("/", GameView);
}
