import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import { zeroAddress } from "viem";
import CollectLootCommandExecutor from "../../command-executors/CollectLootCommandExecutor.js";
import TileCommander from "../../controll/TileCommander.js";
import BuildingManager from "../../data/building/BuildingManager.js";
import TileData from "../../data/tile/TileData.js";
import TileManager from "../../data/tile/TileManager.js";
import UnitManager from "../../data/unit/UnitManager.js";
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
  constructor(private coordinates: Coordinates) {
    super(".tile-command-panel");

    const tileData = TileManager.getCurrentTileData(
      coordinates.x,
      coordinates.y,
    );

    if (!tileData) return;
    if (tileData.occupant === zeroAddress) {
      this.append(
        new CommandButton(
          new ConstructionIcon(),
          "Build",
          () => new ConstructionModal(),
        ),
      );
    } else if (tileData.occupant === WalletLoginManager.getLoggedInAddress()) {
      this.renderLoginUserCommands(tileData);
    } else {
      //TODO:
    }
  }

  private async renderLoginUserCommands(tileData: TileData) {
    const actors: Actor[] = [];

    if (BuildingManager.canBeUpgraded(tileData.buildingId)) {
      actors.push({ type: "building", buildingId: tileData.buildingId });
    }

    for (const unit of tileData.units) {
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
          () => new UpgradeActorInTileModal(this.coordinates, actors),
        ),
      );
    } else {
      const upgradableUnit = tileData.units.find(
        (u) => UnitManager.canBeUpgraded(u.unitId),
      );
      if (upgradableUnit) {
        this.append(
          new CommandButton(
            new UpgradeIcon(),
            "Upgrade",
            () => new UpgradeUnitModal(this.coordinates, upgradableUnit),
          ),
        );
      }

      if (BuildingManager.canBeUpgraded(tileData.buildingId)) {
        this.append(
          new CommandButton(
            new UpgradeIcon(),
            "Upgrade",
            () =>
              new UpgradeBuildingModal(this.coordinates, tileData.buildingId),
          ),
        );
      }
    }

    await this.loadTrainableUnits(tileData);

    if (tileData.units.length > 0) {
      const unitActors: Actor[] = [];

      let totalUnits = 0;

      for (const unit of tileData.units) {
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
          () => TileCommander.waitForUnitCommand("move", tileData.units),
        ),
        new CommandButton(
          new MoveAndAttackIcon(),
          "Move & Attack",
          () =>
            TileCommander.waitForUnitCommand("move-and-attack", tileData.units),
        ),
        new CommandButton(
          new RangedAttackIcon(),
          "Ranged Attack",
          () =>
            TileCommander.waitForUnitCommand("ranged-attack", tileData.units),
        ),
        totalUnits > 1
          ? new CommandButton(
            new SelectUnitIcon(),
            "Select Unit",
            () => new SelectActorInTileModal(this.coordinates, unitActors),
          )
          : undefined,
      );
    }

    if (tileData.loot.length > 0) {
      this.append(
        new CommandButton(
          new LootIcon(),
          "Collect Loot",
          () => CollectLootCommandExecutor.execute(this.coordinates),
        ),
      );
    }
  }

  private async loadTrainableUnits(tileData: TileData) {
    const trainableUnits = await UnitManager.getTrainingBuildingUnits(
      tileData.buildingId,
    );
    if (trainableUnits.length) {
      this.append(
        new CommandButton(
          new TrainIcon(),
          "Train",
          () => new TrainingModal(this.coordinates, tileData.buildingId),
        ),
      );
    }
  }
}
