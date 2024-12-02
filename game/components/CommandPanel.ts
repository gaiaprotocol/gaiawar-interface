import { DomNode } from "@common-module/app";

export default class CommandPanel extends DomNode {
  constructor() {
    super(".command-panel");
    this.append("Command Panel");
  }
}
