import { DomNode } from "@common-module/app";
import ConstructionModal from "../construction/ConstructionModal.js";
import CommandButton from "./CommandButton.js";
import ConstructionIcon from "./icons/ConstructionIcon.js";

export default class CommandPanel extends DomNode {
  constructor() {
    super(".command-panel");
    this.append(
      new CommandButton(
        new ConstructionIcon(),
        "Build",
        () => new ConstructionModal((buildingId) => this.build(buildingId)),
      ),
    );
  }

  private build(buildingId: number) {
    //WorldManager.setBuildingToBuild(buildingId);
  }
}
