import { DomNode } from "@common-module/app";
import ConstructionCostListItem from "./ConstructionCostListItem.js";

export default class ConstructionCostList extends DomNode {
  constructor(costs: { [material: string]: bigint }) {
    super(".construction-cost-list");
    for (const material in costs) {
      this.append(new ConstructionCostListItem(material, costs[material]));
    }
  }
}
