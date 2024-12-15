import ConstructionCommand from "./commands/ConstructionCommand.js";
import TileHoverOverlay from "./world/tile-overlays/TileHoverOverlay.js";
import TileSelectedOverlay from "./world/tile-overlays/TileSelectedOverlay.js";
import World from "./world/World.js";

class GameController {
  private buildingToConstruct: number | undefined;

  public selectTile(x: number, y: number) {
    TileSelectedOverlay.setTilePosition(x, y);

    if (this.buildingToConstruct) {
      ConstructionCommand.constructBuilding(x, y, this.buildingToConstruct);
      this.clearBuildingToConstruct();
    }
  }

  public setBuildingToConstruct(buildingId: number) {
    this.buildingToConstruct = buildingId;
    TileHoverOverlay.setBuildingPreview(buildingId);
    World.showBuildableArea();
  }

  public clearBuildingToConstruct() {
    this.buildingToConstruct = undefined;
    TileHoverOverlay.clearBuildingPreview();
    World.hideBuildableArea();
  }
}

export default new GameController();
