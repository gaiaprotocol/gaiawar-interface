import { BodyNode, Router, SPAInitializer } from "@common-module/app";
import { WalletLoginManager } from "@common-module/wallet-login";
import BuildingManager from "./data/building/BuildingManager.js";
import GaiaWarScreen from "./GaiaWarScreen.js";
import GameConfig, { IGameConfig } from "./GameConfig.js";
import GameView from "./views/GameView.js";

export default async function init(config: IGameConfig) {
  GameConfig.init(config);
  SPAInitializer.init();
  WalletLoginManager.init();

  BuildingManager.loadAllBuildings();

  GaiaWarScreen.appendTo(BodyNode);
  Router.add("/", GameView);
}
