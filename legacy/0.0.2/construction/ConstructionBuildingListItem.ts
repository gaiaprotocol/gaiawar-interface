import { DomNode, el } from "@common-module/app";
import BuildingData from "../building/BuildingData.js";
import ConstructionCostList from "./ConstructionCostList.js";

export default class ConstructionBuildingListItem extends DomNode {
  constructor(building: BuildingData) {
    super(".construction-building-list-item");
    this.append(
      el("h3", building.name),
      el(
        ".image-container",
        el("img", { src: `/assets/buildings/${building.sprites.base}` }),
      ),
      new ConstructionCostList(building.constructionCosts),
    );
  }
}
