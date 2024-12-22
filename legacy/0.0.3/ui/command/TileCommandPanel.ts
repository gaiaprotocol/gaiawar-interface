import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import { zeroAddress } from "viem";
import GameController from "../../core/GameController.js";
import BuildingManager from "../../data/building/BuildingManager.js";
import TileData from "../../data/TileData.js";
import UnitManager from "../../data/unit/UnitManager.js";
import World from "../../world/World.js";
import Actor from "../actor/Actor.js";
import SelectActorInTileModal from "../actor/SelectActorInTileModal.js";
import UpgradeActorInTileModal from "../actor/UpgradeActorInTileModal.js";
import ConstructionModal from "../construction/ConstructionModal.js";
import UpgradeBuildingModal from "../construction/UpgradeBuildingModal.js";
import TrainingModal from "../training/TrainingModal.js";
import UpgradeUnitModal from "../training/UpgradeUnitModal.js";
import CommandButton from "./CommandButton.js";
import CommandPanel from "./CommandPanel.js";
import ConstructionIcon from "./icons/ConstructionIcon.js";
import LootIcon from "./icons/LootIcon.js";
import MoveAndAttackIcon from "./icons/MoveAndAttackIcon.js";
import MoveIcon from "./icons/MoveIcon.js";
import RangedAttackIcon from "./icons/RangedAttackIcon.js";
import SelectUnitIcon from "./icons/SelectUnitIcon.js";
import TrainIcon from "./icons/TrainIcon.js";
import UpgradeIcon from "./icons/UpgradeIcon.js";

export default class TileCommandPanel extends CommandPanel {
  constructor(private coordinates: Coordinates, private tileData: TileData) {
    super(".tile-command-panel");

    if (tileData.occupant === zeroAddress) {
      this.append(
        new CommandButton(
          new ConstructionIcon(),
          "Build",
          () => new ConstructionModal(),
        ),
      );
    } else if (tileData.occupant === WalletLoginManager.getLoggedInAddress()) {
      this.renderLoginUserCommands();
    } else {
      //TODO:
    }
  }

  private async renderLoginUserCommands() {
    const actors: Actor[] = [];

    if (BuildingManager.canBeUpgraded(this.tileData.buildingId)) {
      actors.push({ type: "building", buildingId: this.tileData.buildingId });
    }

    for (const unit of this.tileData.units) {
      if (UnitManager.canBeUpgraded(unit.unitId)) {
        actors.push({
          type: "unit",
          unitId: unit.unitId,
          quantity: unit.quantity,
        });
      }
    }

    if (actors.length > 1) {
      this.append(
        new CommandButton(
          new UpgradeIcon(),
          "Upgrade",
          () => new UpgradeActorInTileModal(actors),
        ),
      );
    } else {
      const upgradableUnit = this.tileData.units.find(
        (u) => UnitManager.canBeUpgraded(u.unitId),
      );
      if (upgradableUnit) {
        this.append(
          new CommandButton(
            new UpgradeIcon(),
            "Upgrade",
            () => new UpgradeUnitModal(upgradableUnit),
          ),
        );
      }

      if (BuildingManager.canBeUpgraded(this.tileData.buildingId)) {
        this.append(
          new CommandButton(
            new UpgradeIcon(),
            "Upgrade",
            () => new UpgradeBuildingModal(this.tileData.buildingId),
          ),
        );
      }
    }

    await this.loadTrainableUnits();

    if (this.tileData.units.length > 0) {
      const unitActors: Actor[] = [];

      let totalUnits = 0;

      for (const unit of this.tileData.units) {
        unitActors.push({
          type: "unit",
          unitId: unit.unitId,
          quantity: unit.quantity,
        });

        totalUnits += unit.quantity;
      }

      this.append(
        new CommandButton(
          new MoveIcon(),
          "Move",
          () => {
            GameController.unitsToMove = this.tileData.units;
            World.showMovableArea(this.coordinates, this.tileData.units);
          },
        ),
        new CommandButton(
          new MoveAndAttackIcon(),
          "Move & Attack",
          () => {
            GameController.unitsToMoveAndAttack = this.tileData.units;
            World.showAttackableArea(this.coordinates, this.tileData.units);
          },
        ),
        new CommandButton(
          new RangedAttackIcon(),
          "Ranged Attack",
          () => {
            GameController.unitsToRangedAttack = this.tileData.units;
            World.showRangedAttackableArea(
              this.coordinates,
              this.tileData.units,
            );
          },
        ),
        totalUnits > 1
          ? new CommandButton(
            new SelectUnitIcon(),
            "Select Unit",
            () => new SelectActorInTileModal(unitActors),
          )
          : undefined,
      );
    }

    if (this.tileData.loot.length > 0) {
      this.append(
        new CommandButton(
          new LootIcon(),
          "Collect Loot",
          () => GameController.collectLoot(),
        ),
      );
    }
  }

  private async loadTrainableUnits() {
    const trainableUnits = await UnitManager.getTrainingBuildingUnits(
      this.tileData.buildingId,
    );
    if (trainableUnits.length) {
      this.append(
        new CommandButton(
          new TrainIcon(),
          "Train",
          () => new TrainingModal(this.tileData.buildingId),
        ),
      );
    }
  }
}
