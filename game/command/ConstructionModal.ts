import { StructuredModal } from "@common-module/app-components";
import BuildingsContract from "../contracts/entities/BuildingsContract.js";

export default class ConstructionModal extends StructuredModal {
  constructor() {
    super(".construction-modal");
    this.loadBuildings();
  }

  private async loadBuildings() {
    const costs = await BuildingsContract.getConstructionCosts(1);
    console.log(costs);
  }
}
