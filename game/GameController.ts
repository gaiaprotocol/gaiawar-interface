import TileSelectedOverlay from "./world/tile-overlays/TileSelectedOverlay.js";

class GameController {
  public selectTile(x: number, y: number) {
    TileSelectedOverlay.setTilePosition(x, y);
  }
}

export default new GameController();
