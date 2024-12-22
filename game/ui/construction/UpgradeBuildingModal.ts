import { el } from "@common-module/app";
import {
  Button,
  ButtonType,
  StructuredModal,
} from "@common-module/app-components";
import { CloseIcon } from "@gaiaprotocol/svg-icons";
import BuildingManager from "../../data/building/BuildingManager.js";
import UserMaterialList from "../material/UserMaterialList.js";
import ConstructionBuildingList from "./ConstructionBuildingList.js";

export default class UpgradeBuildingModal extends StructuredModal {
  private buildingList: ConstructionBuildingList;

  constructor(private previousBuildingId: number) {
    super(".upgrade-building-modal");

    this.appendToHeader(
      el("h2", "Upgrade Your Building"),
      new Button({
        type: ButtonType.Circle,
        icon: new CloseIcon(),
        onClick: () => this.remove(),
      }),
    );
    this.appendToMain(
      el("p", "Select a building to upgrade."),
      this.buildingList = new ConstructionBuildingList(),
    );
    this.appendToFooter(new UserMaterialList());

    this.buildingList.on(
      "buildingSelected",
      (buildingId) => {
        //GameController.upgradeBuilding(buildingId);
        this.remove();
      },
    );

    this.loadBuildings();
  }

  private async loadBuildings() {
    const buildings = await BuildingManager.loadAllBuildings();
    this.buildingList.setBuildings(
      buildings.filter((b) =>
        b.canBeConstructed && b.prerequisiteBuildingId === this.previousBuildingId
      ),
    );
  }
}
