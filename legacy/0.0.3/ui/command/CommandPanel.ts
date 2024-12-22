import { DomNode } from "@common-module/app";

export default abstract class CommandPanel extends DomNode {
  constructor(classNames: `.${string}`) {
    super(`.command-panel${classNames}`);
  }
}
