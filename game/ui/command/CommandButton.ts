import { DomNode, el } from "@common-module/app";

export default class CommandButton extends DomNode {
  constructor(icon: DomNode, title: string, onClick: () => void) {
    super(".command-button");
    this.append(
      icon.clone(),
      el("span.title", title),
    );
    this.onDom("click", () => onClick());
  }
}
