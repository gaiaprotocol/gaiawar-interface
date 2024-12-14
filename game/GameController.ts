import ConstructionContract from "./contracts/commands/ConstructionContract.js";
import TileHoverOverlay from "./world/tile-overlays/TileHoverOverlay.js";
import TileSelectedOverlay from "./world/tile-overlays/TileSelectedOverlay.js";

class GameController {
  private buildingToConstruct: number | undefined;

  public async selectTile(x: number, y: number) {
    TileSelectedOverlay.setTilePosition(x, y);

    if (this.buildingToConstruct) {
      await ConstructionContract.constructBuilding(
        x,
        y,
        this.buildingToConstruct,
      );
      this.clearBuildingToConstruct();
    }
  }

  public async setBuildingToConstruct(buildingId: number) {
    this.buildingToConstruct = buildingId;
    TileHoverOverlay.setBuildingPreview(buildingId);
  }

  public clearBuildingToConstruct() {
    this.buildingToConstruct = undefined;
    TileHoverOverlay.clearBuildingPreview();
  }
}

export default new GameController();
