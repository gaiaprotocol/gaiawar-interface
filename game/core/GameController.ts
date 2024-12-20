import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import UpgradeBuildingCommand from "../commands/base/UpgradeBuildingCommand.js";
import ConstructionCommand from "../commands/ConstructionCommand.js";
import TrainingCommand from "../commands/TrainingCommand.js";
import MoveContract from "../contracts/commands/MoveContract.js";
import { UnitQuantity } from "../data/TileData.js";
import CommandPanelController from "../ui/command/CommandPanelController.js";
import TileHoverOverlay from "../world/tile-overlays/TileHoverOverlay.js";
import TileSelectedOverlay from "../world/tile-overlays/TileSelectedOverlay.js";
import World from "../world/World.js";

class GameController {
  private _buildingToConstruct: number | undefined;
  private _unitsToMove: UnitQuantity[] | undefined;
  private selectedTileCoordinates: Coordinates | undefined;

  constructor() {
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.deselectTile();
        this.buildingToConstruct = undefined;
      }
    });
  }

  public selectTile(coordinates: Coordinates) {
    if (this._unitsToMove) {
      this.moveUnits(coordinates);
      this.unitsToMove = undefined;
    }

    this.selectedTileCoordinates = coordinates;

    if (this._buildingToConstruct) {
      this.constructBuilding();
      this.buildingToConstruct = undefined;
    }

    TileSelectedOverlay.setTilePosition(coordinates);

    const tile = World.getTile(coordinates);
    if (tile) {
      if (tile.getBuildingId() !== 0) {
        if (tile.getOccupant() === WalletLoginManager.getLoggedInAddress()) {
          CommandPanelController.changePanel("tile", {
            coordinates,
            tileData: tile.data,
          });
          return;
        }
      }
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
      await TrainingCommand.trainUnits(
        this.selectedTileCoordinates,
        unitQuantity,
      );
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

  public async moveUnits(to: Coordinates) {
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
    } finally {
      //TODO:
    }
  }
}

export default new GameController();
