import { Router, SPAInitializer } from "@common-module/app";
import GaiaWarConfig, { IGaiaWarConfig } from "./config/GaiaWarConfig.js";
import GaiaWarController from "./controll/GaiaWarController.js";
import BuildingManager from "./data/building/BuildingManager.js";
import UserMaterialManager from "./data/material/UserMaterialManager.js";
import UnitManager from "./data/unit/UnitManager.js";
import GameView from "./views/GameView.js";

export default async function init(config: IGaiaWarConfig) {
  GaiaWarConfig.init(config);
  SPAInitializer.init();

  BuildingManager.loadAllBuildings();
  UnitManager.loadAllUnits();
  UserMaterialManager.reloadBalances();

  /*GameScreen.appendTo(BodyNode);

  if (GameConfig.isDevMode) {
    GameScreen.root.append(new FPSDisplay(0, 110));
  }

  LiveEventObserver.install();*/
  GaiaWarController.init();

  Router.add("/", GameView);
}
