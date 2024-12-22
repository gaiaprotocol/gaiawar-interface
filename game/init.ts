import { BodyNode, Router, SPAInitializer } from "@common-module/app";
import { WalletLoginManager } from "@common-module/wallet-login";
import { FPSDisplay } from "@gaiaengine/2d";
import GameConfig, { IGaiaWarConfig } from "./config/GaiaWarConfig.js";
import BuildingManager from "./data/building/BuildingManager.js";
import UserMaterialManager from "./data/material/UserMaterialManager.js";
import UnitManager from "./data/unit/UnitManager.js";
import GameView from "./views/GameView.js";

export default async function init(config: IGaiaWarConfig) {
  GameConfig.init(config);
  SPAInitializer.init();
  WalletLoginManager.init();

  BuildingManager.loadAllBuildings();
  UnitManager.loadAllUnits();
  UserMaterialManager.reloadBalances();

  /*GameScreen.appendTo(BodyNode);

  if (GameConfig.isDevMode) {
    GameScreen.root.append(new FPSDisplay(0, 110));
  }

  LiveEventObserver.install();*/

  Router.add("/", GameView);
}
