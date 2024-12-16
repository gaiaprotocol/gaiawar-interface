import { DomNode, el } from "@common-module/app";
import BuildingData from "../../data/building/BuildingData.js";
import CostList from "../cost/CostList.js";

export default class ConstructionBuildingListItem extends DomNode {
  constructor(building: BuildingData) {
    super(".construction-building-list-item");
    this.append(
      el("h3", building.name),
      el(
        ".image-container",
        el("img", { src: `/assets/${building.sprites.base}` }),
      ),
      new CostList(building.constructionCosts),
    );
  }
}
