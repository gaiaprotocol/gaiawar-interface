import BuildingManager from "../../data/building/BuildingManager.js";
import UnitManager from "../../data/unit/UnitManager.js";
import UpgradeBuildingModal from "../construction/UpgradeBuildingModal.js";
import TrainingModal from "../training/TrainingModal.js";
import CommandButton from "./CommandButton.js";
import CommandPanel from "./CommandPanel.js";
import TrainIcon from "./icons/TrainIcon.js";
import UpgradeIcon from "./icons/UpgradeIcon.js";

export default class BuildingCommandPanel extends CommandPanel {
  constructor(private buildingId: number) {
    super(".building-command-panel");

    if (BuildingManager.canBeUpgraded(buildingId)) {
      this.append(
        new CommandButton(
          new UpgradeIcon(),
          "Upgrade",
          () => new UpgradeBuildingModal(buildingId),
        ),
      );
    }

    this.loadTrainableUnits();
  }

  private async loadTrainableUnits() {
    const trainableUnits = await UnitManager.getTrainingBuildingUnits(
      this.buildingId,
    );
    if (trainableUnits.length) {
      this.append(
        new CommandButton(
          new TrainIcon(),
          "Train",
          () => new TrainingModal(this.buildingId),
        ),
      );
    }
  }
}
