import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import ConstructionCommand from "./commands/ConstructionCommand.js";
import CommandPanelController from "./ui/command/CommandPanelController.js";
import TileHoverOverlay from "./world/tile-overlays/TileHoverOverlay.js";
import TileSelectedOverlay from "./world/tile-overlays/TileSelectedOverlay.js";
import World from "./world/World.js";

class GameController {
  private _buildingToConstruct: number | undefined;
  private selectedTile: Coordinates | undefined;

  constructor() {
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.deselectTile();
        this.buildingToConstruct = undefined;
      }
    });
  }

  public selectTile(x: number, y: number) {
    this.selectedTile = { x, y };

    TileSelectedOverlay.setTilePosition(x, y);

    if (this._buildingToConstruct) {
      this.constructBuilding();
      this.buildingToConstruct = undefined;
    }

    const tile = World.getTile(x, y);
    if (tile) {
      if (tile.getBuildingId() !== 0) {
        if (tile.getOwner() === WalletLoginManager.getLoggedInAddress()) {
          CommandPanelController.changePanel("player-building", {
            buildingId: tile.getBuildingId(),
          });
          return;
        }
      }
    }

    CommandPanelController.changePanel("world");
  }

  public deselectTile() {
    TileSelectedOverlay.setTilePosition(-999999, -999999);
    CommandPanelController.changePanel("world");
  }

  private async constructBuilding() {
    if (!this._buildingToConstruct || !this.selectedTile) return;

    const tile = World.getTile(this.selectedTile.x, this.selectedTile.y);
    if (!tile) return;

    const walletAddress = WalletLoginManager.getLoggedInAddress();
    if (!walletAddress) return;

    tile.showConstructing();
    try {
      const buildingId = this._buildingToConstruct;
      if (
        await ConstructionCommand.constructBuilding(
          this.selectedTile.x,
          this.selectedTile.y,
          buildingId,
        )
      ) {
        tile.setBuilding(walletAddress, buildingId);
      }
    } finally {
      tile.hideConstructing();
    }
  }

  public async upgradeBuilding(buildingId: number) {
    if (!this.selectedTile) return;

    const tile = World.getTile(this.selectedTile.x, this.selectedTile.y);
    if (!tile) return;

    const walletAddress = WalletLoginManager.getLoggedInAddress();
    if (!walletAddress) return;

    tile.showConstructing();
    try {
      if (
        await ConstructionCommand.upgradeBuilding(
          this.selectedTile.x,
          this.selectedTile.y,
          buildingId,
        )
      ) {
        tile.setBuilding(walletAddress, buildingId);
      }
    } finally {
      tile.hideConstructing();
    }
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
}

export default new GameController();
