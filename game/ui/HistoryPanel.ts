import { DomNode } from "@common-module/app";

export default class HistoryPanel extends DomNode {
  constructor() {
    super(".history-panel");
    this.text = "History Panel";
  }
}
