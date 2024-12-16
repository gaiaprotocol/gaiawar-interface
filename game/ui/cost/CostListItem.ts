import { DomNode, el } from "@common-module/app";
import { formatEther } from "viem";
import MaterialType from "../../data/material/MaterialType.js";
import materialIcons from "../material/materialIcons.js";

export default class CostListItem extends DomNode {
  constructor(material: MaterialType, cost: bigint) {
    super(".cost-list-item");
    this.append(
      el("img.icon", { src: materialIcons[material] }),
      formatEther(cost),
    );
  }
}
