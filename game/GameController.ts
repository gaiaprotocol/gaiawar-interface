import ConstructionCommand from "./commands/ConstructionCommand.js";
import TileHoverOverlay from "./world/tile-overlays/TileHoverOverlay.js";
import TileSelectedOverlay from "./world/tile-overlays/TileSelectedOverlay.js";
import World from "./world/World.js";

class GameController {
  private _buildingToConstruct: number | undefined;

  public selectTile(x: number, y: number) {
    TileSelectedOverlay.setTilePosition(x, y);

    if (this._buildingToConstruct) {
      this.constructBuilding(x, y);
      this.buildingToConstruct = undefined;
    }
  }

  private async constructBuilding(x: number, y: number) {
    if (!this._buildingToConstruct) {
      return;
    }

    const tile = World.getTile(x, y);
    tile?.showConstructing();

    try {
      await ConstructionCommand.constructBuilding(
        x,
        y,
        this._buildingToConstruct,
      );
    } finally {
      tile?.hideConstructing();
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
