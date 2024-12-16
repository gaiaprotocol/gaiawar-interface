import { DomNode, el } from "@common-module/app";
import UnitData from "../../data/unit/UnitData.js";
import CostList from "../cost/CostList.js";

export default class TrainingUnitListItem extends DomNode {
  constructor(unit: UnitData) {
    super(".training-unit-list-item");
    this.append(
      el("h3", unit.name),
      el(
        ".image-container",
        el("img", { src: `/assets/${unit.previewImage}` }),
      ),
      new CostList(unit.trainingCosts),
    );
  }
}
