import { DomNode } from "@common-module/app";
import Building from "../building/Building.js";
import ConstructionCostList from "./ConstructionCostList.js";

export default class ConstructionBuildingListItem extends DomNode {
  constructor(building: Building) {
    super(".construction-building-list-item");
    this.append(
      building.name,
      new ConstructionCostList(building.constructionCosts),
    );
  }
}
