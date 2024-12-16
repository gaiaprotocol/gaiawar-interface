import ConstructionModal from "../construction/ConstructionModal.js";
import CommandButton from "./CommandButton.js";
import CommandPanel from "./CommandPanel.js";
import ConstructionIcon from "./icons/ConstructionIcon.js";

export default class WorldCommandPanel extends CommandPanel {
  constructor() {
    super(".world-command-panel");
    this.append(
      new CommandButton(
        new ConstructionIcon(),
        "Build",
        () => new ConstructionModal(),
      ),
    );
  }
}
