import { DomNode } from "@common-module/app";
import MaterialPanelItem from "./MaterialPanelItem.js";

export default class MaterialPanel extends DomNode {
  public children: MaterialPanelItem[] = [];

  constructor() {
    super(".material-panel");
    this.append(
      new MaterialPanelItem("wood"),
      new MaterialPanelItem("stone"),
      new MaterialPanelItem("iron"),
      new MaterialPanelItem("ducat"),
    );
  }
}
