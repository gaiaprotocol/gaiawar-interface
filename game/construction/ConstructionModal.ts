import { StructuredModal } from "@common-module/app-components";
import BuildingManager from "../building/BuildingManager.js";
import ConstructionBuildingList from "./ConstructionBuildingList.js";

export default class ConstructionModal extends StructuredModal {
  private buildingList: ConstructionBuildingList;

  constructor() {
    super(".construction-modal");
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
