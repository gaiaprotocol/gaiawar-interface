import { BodyNode, Router, SPAInitializer } from "@common-module/app";
import { WalletLoginManager } from "@common-module/wallet-login";
import { FPSDisplay } from "@gaiaengine/2d";
import BuildingManager from "./data/building/BuildingManager.js";
import UserMaterialManager from "./data/material/UserMaterialManager.js";
import UnitManager from "./data/unit/UnitManager.js";
import GameConfig, { IGameConfig } from "./GameConfig.js";
import GameScreen from "./core/GameScreen.js";
import GameView from "./views/GameView.js";

export default async function init(config: IGameConfig) {
  GameConfig.init(config);
  SPAInitializer.init();
  WalletLoginManager.init();

  BuildingManager.loadAllBuildings();
  UnitManager.loadAllUnits();
  UserMaterialManager.reloadBalances();

  GameScreen.appendTo(BodyNode);

  if (GameConfig.isDevMode) {
    GameScreen.root.append(new FPSDisplay(0, 110));
  }

  Router.add("/", GameView);
}
