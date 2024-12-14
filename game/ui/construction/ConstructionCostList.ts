import { DomNode } from "@common-module/app";
import MaterialType from "../../data/material/MaterialType.js";
import ConstructionCostListItem from "./ConstructionCostListItem.js";

export default class ConstructionCostList extends DomNode {
  constructor(costs: { [material: string]: bigint }) {
    super(".construction-cost-list");
    for (const material in costs) {
      this.append(
        new ConstructionCostListItem(material as MaterialType, costs[material]),
      );
    }
  }
}
