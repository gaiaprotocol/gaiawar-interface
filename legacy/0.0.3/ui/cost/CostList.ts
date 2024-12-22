import { DomNode } from "@common-module/app";
import MaterialType from "../../data/material/MaterialType.js";
import CostListItem from "./CostListItem.js";

export default class CostList extends DomNode {
  constructor(costs: { [material: string]: bigint }) {
    super(".cost-list");
    for (const material in costs) {
      this.append(
        new CostListItem(material as MaterialType, costs[material]),
      );
    }
  }
}
