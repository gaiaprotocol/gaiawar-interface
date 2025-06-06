import { el } from "@common-module/app";
import {
  Button,
  ButtonType,
  StructuredModal,
} from "@common-module/app-components";
import { CloseIcon } from "@gaiaprotocol/svg-icons";
import BuildingManager from "../building/BuildingManager.js";
import UserMaterialList from "../material/UserMaterialList.js";
import ConstructionBuildingList from "./ConstructionBuildingList.js";

export default class ConstructionModal extends StructuredModal {
  private buildingList: ConstructionBuildingList;

  constructor(onBuild: (buildingId: number) => void) {
    super(".construction-modal");
    this.appendToHeader(
      el("h2", "Build Buildings"),
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
        onBuild(buildingId);
        this.remove();
      },
    );

    this.loadBuildings();
  }

  private async loadBuildings() {
    const buildings = await BuildingManager.loadAllBuildings();
    this.buildingList.setBuildings(buildings);
  }
}
