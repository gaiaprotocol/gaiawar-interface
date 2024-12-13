import { DomNode } from "@common-module/app";
import { formatEther } from "viem";

export default class ConstructionCostListItem extends DomNode {
  constructor(material: string, cost: bigint) {
    super(".construction-cost-list-item");
    this.append(
      material,
      formatEther(cost),
    );
  }
}
