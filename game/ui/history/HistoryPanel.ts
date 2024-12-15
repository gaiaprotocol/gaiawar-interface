import { DomNode, el } from "@common-module/app";
import { Button, ButtonType } from "@common-module/app-components";
import { CollapseIcon, ExpandIcon } from "@gaiaprotocol/svg-icons";

export default class HistoryPanel extends DomNode {
  constructor() {
    super(".history-panel");
    this.append(
      el(
        "footer",
        el(
          ".button-container",
          new Button({
            type: ButtonType.Circle,
            icon: new CollapseIcon(),
          }),
          new Button({
            type: ButtonType.Circle,
            icon: new ExpandIcon(),
          }),
        ),
      ),
    );
  }
}
