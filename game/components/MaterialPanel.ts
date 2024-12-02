import { DomNode } from "@common-module/app";

export default class MaterialPanel extends DomNode {
  constructor() {
    super(".material-panel");
    this.append("Material Panel");
  }
}
