import ConstructionCommand from "./commands/ConstructionCommand.js";
import TileHoverOverlay from "./world/tile-overlays/TileHoverOverlay.js";
import TileSelectedOverlay from "./world/tile-overlays/TileSelectedOverlay.js";
import World from "./world/World.js";

class GameController {
  private _buildingToConstruct: number | undefined;

  public selectTile(x: number, y: number) {
    TileSelectedOverlay.setTilePosition(x, y);

    if (this._buildingToConstruct) {
      ConstructionCommand.constructBuilding(x, y, this._buildingToConstruct);
      this.buildingToConstruct = undefined;
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
