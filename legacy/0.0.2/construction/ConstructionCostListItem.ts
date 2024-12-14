import { DomNode, el } from "@common-module/app";
import { formatEther } from "viem";
import materialIcons from "../material/materialIcons.js";
import MaterialType from "../material/MaterialType.js";

export default class ConstructionCostListItem extends DomNode {
  constructor(material: MaterialType, cost: bigint) {
    super(".construction-cost-list-item");
    this.append(
      el("img.icon", { src: materialIcons[material] }),
      formatEther(cost),
    );
  }
}
