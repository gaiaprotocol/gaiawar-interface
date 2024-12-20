import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import UpgradeBuildingCommand from "../commands/base/UpgradeBuildingCommand.js";
import ConstructionCommand from "../commands/ConstructionCommand.js";
import TrainingCommand from "../commands/TrainingCommand.js";
import CommandPanelController from "../ui/command/CommandPanelController.js";
import TileHoverOverlay from "../world/tile-overlays/TileHoverOverlay.js";
import TileSelectedOverlay from "../world/tile-overlays/TileSelectedOverlay.js";
import World from "../world/World.js";

class GameController {
  private _buildingToConstruct: number | undefined;
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
    this.selectedTileCoordinates = coordinates;

    TileSelectedOverlay.setTilePosition(coordinates);

    if (this._buildingToConstruct) {
      this.constructBuilding();
      this.buildingToConstruct = undefined;
    }

    const tile = World.getTile(coordinates);
    if (tile) {
      if (tile.getBuildingId() !== 0) {
        if (tile.getOccupant() === WalletLoginManager.getLoggedInAddress()) {
          CommandPanelController.changePanel("tile", tile.data);
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
      World.hideBuildableArea();
    }
  }

  private async constructBuilding() {
    if (!this._buildingToConstruct || !this.selectedTileCoordinates) return;

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

  public async trainUnits(unitId: number, quantity: number) {
    if (!this.selectedTileCoordinates) return;

    const tile = World.getTile(this.selectedTileCoordinates);
    if (!tile) return;

    const walletAddress = WalletLoginManager.getLoggedInAddress();
    if (!walletAddress) return;

    tile.showTraining("player");
    try {
      await TrainingCommand.trainUnits(
        this.selectedTileCoordinates,
        unitId,
        quantity,
      );
    } finally {
      tile.hideProgressObject();
    }
  }
}

export default new GameController();
