import { el } from "@common-module/app";
import {
  Button,
  ButtonType,
  StructuredModal,
} from "@common-module/app-components";
import { Coordinates } from "@gaiaengine/2d";
import { CloseIcon } from "@gaiaprotocol/svg-icons";
import UpgradeBuildingCommandExecutor from "../../command-executors/UpgradeBuildingCommandExecutor.js";
import BuildingManager from "../../data/building/BuildingManager.js";
import UserMaterialList from "../material/UserMaterialList.js";
import ConstructionBuildingList from "./ConstructionBuildingList.js";

export default class UpgradeBuildingModal extends StructuredModal {
  private buildingList: ConstructionBuildingList;

  constructor(coordinates: Coordinates, private previousBuildingId: number) {
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
        UpgradeBuildingCommandExecutor.execute(coordinates, buildingId);
        this.remove();
      },
    );

    this.loadBuildings();
  }

  private async loadBuildings() {
    const buildings = await BuildingManager.loadAllBuildings();
    this.buildingList.setBuildings(
      buildings.filter((b) =>
        b.canBeConstructed &&
        b.prerequisiteBuildingId === this.previousBuildingId
      ),
    );
  }
}
