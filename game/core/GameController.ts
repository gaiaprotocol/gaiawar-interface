import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import UpgradeBuildingCommand from "../commands/base/UpgradeBuildingCommand.js";
import ConstructionCommand from "../commands/ConstructionCommand.js";
import TrainingCommand from "../commands/TrainingCommand.js";
import MoveAndAttackContract from "../contracts/commands/MoveAndAttackContract.js";
import MoveContract from "../contracts/commands/MoveContract.js";
import RangedAttackContract from "../contracts/commands/RangedAttackContract.js";
import BattlegroundContract from "../contracts/core/BattlegroundContract.js";
import { UnitQuantity } from "../data/TileData.js";
import CommandPanelController from "../ui/command/CommandPanelController.js";
import TileHoverOverlay from "../world/tile-overlays/TileHoverOverlay.js";
import TileSelectedOverlay from "../world/tile-overlays/TileSelectedOverlay.js";
import World from "../world/World.js";

class GameController {
  private _buildingToConstruct: number | undefined;
  private _unitsToMove: UnitQuantity[] | undefined;
  private _unitsToMoveAndAttack: UnitQuantity[] | undefined;
  private _unitsToRangedAttack: UnitQuantity[] | undefined;

  public selectedTileCoordinates: Coordinates | undefined;

  constructor() {
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.deselectTile();
        this.buildingToConstruct = undefined;
        this.unitsToMove = undefined;
        this.unitsToMoveAndAttack = undefined;
        this.unitsToRangedAttack = undefined;
      }
    });
  }

  public selectTile(coordinates: Coordinates) {
    if (this._unitsToMove) {
      this.move(coordinates);
      this.unitsToMove = undefined;
    }

    if (this._unitsToMoveAndAttack) {
      this.moveAndAttack(coordinates);
      this.unitsToMoveAndAttack = undefined;
    }

    if (this._unitsToRangedAttack) {
      this.rangedAttack(coordinates);
      this.unitsToRangedAttack = undefined;
    }

    this.selectedTileCoordinates = coordinates;

    if (this._buildingToConstruct) {
      this.constructBuilding();
      this.buildingToConstruct = undefined;
    }

    TileSelectedOverlay.setTilePosition(coordinates);

    const tile = World.getTile(coordinates);
    if (
      tile && tile.getOccupant() === WalletLoginManager.getLoggedInAddress()
    ) {
      CommandPanelController.changePanel("tile", {
        coordinates,
        tileData: tile.data,
      });
      return;
    }

    CommandPanelController.changePanel("world");
  }

  public deselectTile() {
    TileSelectedOverlay.setTilePosition({ x: -999999, y: -999999 });
    CommandPanelController.changePanel("world");
  }

  public get buildingToConstruct() {
    return this._buildingToConstruct;
  }

  public set buildingToConstruct(buildingId: number | undefined) {
    this._buildingToConstruct = buildingId;
    if (buildingId) {
      TileHoverOverlay.setBuildingPreview(buildingId);
    } else {
      TileHoverOverlay.clearBuildingPreview();
      World.hideConstructableArea();
    }
  }

  private async constructBuilding() {
    if (!this.selectedTileCoordinates || !this._buildingToConstruct) return;

    const tile = World.getTile(this.selectedTileCoordinates);
    if (!tile) return;

    const walletAddress = WalletLoginManager.getLoggedInAddress();
    if (!walletAddress) return;

    tile.showConstructing("player");
    try {
      const buildingId = this._buildingToConstruct;
      if (
        await ConstructionCommand.constructBuilding(
          this.selectedTileCoordinates,
          buildingId,
        )
      ) {
        tile.setBuilding(walletAddress, buildingId);
      }
    } finally {
      tile.hideProgressObject();
    }
  }

  public async upgradeBuilding(buildingId: number) {
    if (!this.selectedTileCoordinates) return;

    const tile = World.getTile(this.selectedTileCoordinates);
    if (!tile) return;

    const walletAddress = WalletLoginManager.getLoggedInAddress();
    if (!walletAddress) return;

    tile.showConstructing("player");
    try {
      if (
        await UpgradeBuildingCommand.upgradeBuilding(
          this.selectedTileCoordinates,
          buildingId,
        )
      ) {
        tile.setBuilding(walletAddress, buildingId);
      }
    } finally {
      tile.hideProgressObject();
    }
  }

  public async trainUnits(unitQuantity: UnitQuantity) {
    if (!this.selectedTileCoordinates) return;

    const tile = World.getTile(this.selectedTileCoordinates);
    if (!tile) return;

    const walletAddress = WalletLoginManager.getLoggedInAddress();
    if (!walletAddress) return;

    tile.showTraining("player");
    try {
      if (
        await TrainingCommand.trainUnits(
          this.selectedTileCoordinates,
          unitQuantity,
        )
      ) {
        const units = tile.getUnits();

        let found = false;
        for (const unit of units) {
          if (unit.unitId === unitQuantity.unitId) {
            unit.quantity += unitQuantity.quantity;
            found = true;
            break;
          }
        }
        if (!found) units.push(unitQuantity);

        tile.setUnitGroup(units);
      }
    } finally {
      tile.hideProgressObject();
    }
  }

  public get unitsToMove() {
    return this._unitsToMove;
  }

  public set unitsToMove(units: UnitQuantity[] | undefined) {
    this._unitsToMove = units;
    if (units) {
      //TODO:
    } else {
      //TODO:
      World.hideMovableArea();
    }
  }

  public async move(to: Coordinates) {
    if (!this.selectedTileCoordinates || !this._unitsToMove) return;

    const tile = World.getTile(to);
    if (!tile) return;

    const walletAddress = WalletLoginManager.getLoggedInAddress();
    if (!walletAddress) return;

    //TODO:
    try {
      await MoveContract.move(
        this.selectedTileCoordinates,
        to,
        this._unitsToMove,
      );

      const units = tile.getUnits();

      for (const unitToMove of this._unitsToMove) {
        let found = false;
        for (const unit of units) {
          if (unit.unitId === unitToMove.unitId) {
            unit.quantity += unitToMove.quantity;
            found = true;
            break;
          }
        }
        if (!found) units.push(unitToMove);
      }

      tile.setUnitGroup(units);
    } finally {
      //TODO:
    }
  }

  public get unitsToMoveAndAttack() {
    return this._unitsToMoveAndAttack;
  }

  public set unitsToMoveAndAttack(units: UnitQuantity[] | undefined) {
    this._unitsToMoveAndAttack = units;
    if (units) {
      //TODO:
    } else {
      //TODO:
      World.hideAttackableArea();
    }
  }

  public async moveAndAttack(to: Coordinates) {
    if (!this.selectedTileCoordinates || !this._unitsToMoveAndAttack) return;

    const tile = World.getTile(to);
    if (!tile) return;

    const walletAddress = WalletLoginManager.getLoggedInAddress();
    if (!walletAddress) return;

    //TODO:
    try {
      await MoveAndAttackContract.moveAndAttack(
        this.selectedTileCoordinates,
        to,
        this._unitsToMoveAndAttack,
      );
      //TODO:
    } finally {
      //TODO:
    }
  }

  public get unitsToRangedAttack() {
    return this._unitsToRangedAttack;
  }

  public set unitsToRangedAttack(units: UnitQuantity[] | undefined) {
    this._unitsToRangedAttack = units;
    if (units) {
      //TODO:
    } else {
      //TODO:
      World.hideRangedAttackableArea();
    }
  }

  public async rangedAttack(to: Coordinates) {
    if (!this.selectedTileCoordinates || !this._unitsToRangedAttack) return;

    const tile = World.getTile(to);
    if (!tile) return;

    const walletAddress = WalletLoginManager.getLoggedInAddress();
    if (!walletAddress) return;

    //TODO:
    try {
      await RangedAttackContract.rangedAttack(
        this.selectedTileCoordinates,
        to,
        this._unitsToRangedAttack,
      );
      //TODO:
    } finally {
      //TODO:
    }
  }

  public async collectLoot() {
    if (!this.selectedTileCoordinates) return;

    const tile = World.getTile(this.selectedTileCoordinates);
    if (!tile) return;

    const walletAddress = WalletLoginManager.getLoggedInAddress();
    if (!walletAddress) return;

    //TODO:
    try {
      await BattlegroundContract.collectLoot(this.selectedTileCoordinates);
      //TODO:
    } finally {
      //TODO:
    }
  }
}

export default new GameController();
