import { DomNode, el } from "@common-module/app";
import { Button, ButtonType } from "@common-module/app-components";
import Building from "../building/Building.js";
import ConstructionIcon from "../command/icons/ConstructionIcon.js";
import ConstructionCostList from "./ConstructionCostList.js";

export default class ConstructionBuildingListItem extends DomNode {
  constructor(building: Building) {
    super(".construction-building-list-item");
    this.append(
      el("h3", building.name),
      el(
        ".image-container",
        el("img", { src: `/assets/${building.assets.base}` }),
      ),
      new ConstructionCostList(building.constructionCosts),
      el(
        ".button-container",
        new Button({
          type: ButtonType.Contained,
          icon: new ConstructionIcon(),
          title: "Build",
        }),
      ),
    );
  }
}
