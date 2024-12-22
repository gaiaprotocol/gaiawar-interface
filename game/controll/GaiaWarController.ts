import { BodyNode } from "@common-module/app";
import { FPSDisplay } from "@gaiaengine/2d";
import GaiaWarConfig from "../config/GaiaWarConfig.js";
import TileManager from "../data/tile/TileManager.js";
import World from "../game-objects/world/World.js";
import GaiaWarScreen from "./GaiaWarScreen.js";

class GaiaWarController {
  private screen!: GaiaWarScreen;
  private world!: World;

  public init() {
    this.screen = new GaiaWarScreen().appendTo(BodyNode);
    this.screen.root.append(
      this.world = new World({
        onTileRangeChanged: (range) => TileManager.setTileRange(range),
      }),
      GaiaWarConfig.isDevMode ? new FPSDisplay(0, 110) : undefined,
    );
  }
}

export default new GaiaWarController();
