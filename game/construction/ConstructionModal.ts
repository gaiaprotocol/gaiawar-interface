import { StructuredModal } from "@common-module/app-components";
import BuildingManager from "../building/BuildingManager.js";
import ConstructionBuildingList from "./ConstructionBuildingList.js";
import { el } from "@common-module/app";

export default class ConstructionModal extends StructuredModal {
  private buildingList: ConstructionBuildingList;

  constructor() {
    super(".construction-modal");
    this.appendToHeader(el("h2", "Build Buildings"));
    this.appendToMain(
      this.buildingList = new ConstructionBuildingList(),
    );
    this.loadBuildings();
  }

  private async loadBuildings() {
    const buildings = await BuildingManager.loadAllBuildings();
    this.buildingList.setBuildings(buildings);
  }
}
