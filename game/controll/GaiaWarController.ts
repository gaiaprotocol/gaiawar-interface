import { BodyNode } from "@common-module/app";
import { FPSDisplay, GameObject } from "@gaiaengine/2d";
import GaiaWarConfig from "../config/GaiaWarConfig.js";
import TileManager from "../data/tile/TileManager.js";
import TileHover from "../game-objects/tile-overlays/TileHover.js";
import TileSelected from "../game-objects/tile-overlays/TileSelected.js";
import World from "../game-objects/world/World.js";
import GaiaWarScreen from "./GaiaWarScreen.js";

class GaiaWarController {
  private screen!: GaiaWarScreen;
  private world!: World;
  private tileHover!: TileHover;
  private tileSelected!: TileSelected;

  public init() {
    this.screen = new GaiaWarScreen({
      onTileHover: (coord) => this.tileHover.setTilePosition(coord),
      onTileSelected: (coord) => this.tileSelected.setTilePosition(coord),
    }).appendTo(BodyNode);
    this.screen.root.append(
      this.world = new World({
        onTileRangeChanged: (range) => TileManager.setTileRange(range),
      }),
      new GameObject(
        0,
        0,
        this.tileHover = new TileHover(),
        this.tileSelected = new TileSelected(),
      ),
      GaiaWarConfig.isDevMode ? new FPSDisplay(0, 110) : undefined,
    );
  }
}

export default new GaiaWarController();
