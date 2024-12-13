import { StructuredModal } from "@common-module/app-components";
import BuildingManager from "./BuildingManager.js";

export default class ConstructionModal extends StructuredModal {
  constructor() {
    super(".construction-modal");
    this.loadBuildings();
  }

  private async loadBuildings() {
    const building = await BuildingManager.getBuilding(1);
    console.log(building);
  }
}
