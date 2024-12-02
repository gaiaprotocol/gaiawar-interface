import { DomNode, el } from "@common-module/app";
import { Button, ButtonType } from "@common-module/app-components";
import { CollapseIcon, ExpandIcon } from "@gaiaprotocol/svg-icons";

export default class ChatRoom extends DomNode {
  constructor() {
    super(".chat-room");
    this.append(
      el(
        "header",
        el("h2", "Chat Room"),
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
