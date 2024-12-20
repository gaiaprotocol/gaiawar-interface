import { el } from "@common-module/app";
import {
  Button,
  ButtonType,
  StructuredModal,
} from "@common-module/app-components";
import { CloseIcon } from "@gaiaprotocol/svg-icons";
import BuildingManager from "../../data/building/BuildingManager.js";
import GameController from "../../core/GameController.js";
import World from "../../world/World.js";
import UserMaterialList from "../material/UserMaterialList.js";
import ConstructionBuildingList from "./ConstructionBuildingList.js";

export default class ConstructionModal extends StructuredModal {
  private buildingList: ConstructionBuildingList;

  constructor() {
    super(".construction-modal");

    this.appendToHeader(
      el("h2", "Construct a Building"),
      new Button({
        type: ButtonType.Circle,
        icon: new CloseIcon(),
        onClick: () => this.remove(),
      }),
    );
    this.appendToMain(
      el("p", "Select a building to construct."),
      this.buildingList = new ConstructionBuildingList(),
    );
    this.appendToFooter(new UserMaterialList());

    this.buildingList.on(
      "buildingSelected",
      (buildingId) => {
        GameController.buildingToConstruct = buildingId;
        this.remove();
      },
    );

    this.loadBuildings();

    World.showBuildableArea();

    this.on("remove", () => {
      if (!GameController.buildingToConstruct) {
        World.hideBuildableArea();
      }
    });
  }

  private async loadBuildings() {
    const buildings = await BuildingManager.loadAllBuildings();
    this.buildingList.setBuildings(
      buildings.filter((b) => b.canBeConstructed && b.prerequisiteBuildingId === 0),
    );
  }
}
