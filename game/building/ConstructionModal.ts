import { StructuredModal } from "@common-module/app-components";
import BuildingManager from "./BuildingManager.js";

export default class ConstructionModal extends StructuredModal {
  constructor() {
    super(".construction-modal");
    this.loadBuildings();
  }

  private async loadBuildings() {
    const buildings = await BuildingManager.loadAllBuildings();
    console.log(buildings);
  }
}
