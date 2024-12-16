import BuildingManager from "../../data/building/BuildingManager.js";
import UpgradeBuildingModal from "../construction/UpgradeBuildingModal.js";
import CommandButton from "./CommandButton.js";
import CommandPanel from "./CommandPanel.js";
import UpgradeIcon from "./icons/UpgradeIcon.js";

export default class BuildingCommandPanel extends CommandPanel {
  constructor(buildingId: number) {
    super(".building-command-panel");
    this.append(
      BuildingManager.canBeUpgraded(buildingId)
        ? new CommandButton(
          new UpgradeIcon(),
          "Upgrade",
          () => new UpgradeBuildingModal(buildingId),
        )
        : undefined,
    );
  }
}
