import { BodyNode } from "@common-module/app";
import { Coordinates, FPSDisplay, GameObject } from "@gaiaengine/2d";
import GaiaWarConfig from "../config/GaiaWarConfig.js";
import PendingCommandManager from "../data/pending-command/PendingCommandManager.js";
import TileAvailableMapCalculator from "../data/tile/TileAvailableMapCalculator.js";
import TileManager from "../data/tile/TileManager.js";
import ActionableArea from "../game-objects/tile-overlays/ActionableArea.js";
import TileHover from "../game-objects/tile-overlays/TileHover.js";
import TileSelected from "../game-objects/tile-overlays/TileSelected.js";
import World from "../game-objects/world/World.js";
import CommandPanelController from "../ui/command/CommandPanelController.js";
import GaiaWarScreen from "./GaiaWarScreen.js";
import TileCommander from "./TileCommander.js";

class GaiaWarController {
  private screen!: GaiaWarScreen;
  private world!: World;
  private actionableArea!: ActionableArea;
  private tileHover!: TileHover;
  private tileSelected!: TileSelected;

  public init() {
    this.screen = new GaiaWarScreen({
      onTileHover: (coord) => this.tileHover.setTilePosition(coord),
      onTileSelected: (coord) => this.selectTile(coord),
    }).appendTo(BodyNode);

    this.screen.root.append(
      this.world = new World({
        onTileRangeChanged: (range) => TileManager.setTileRange(range),
      }),
      this.actionableArea = new ActionableArea(),
      new GameObject(
        0,
        0,
        this.tileHover = new TileHover(),
        this.tileSelected = new TileSelected(),
      ),
      GaiaWarConfig.isDevMode ? new FPSDisplay(0, 110) : undefined,
    );

    TileManager.on("tilesLoaded", (tiles) => this.world.updateTiles(tiles));

    PendingCommandManager.init().on(
      "pendingCommandsChanged",
      (pendingCommands) => this.world.updatePendingCommands(pendingCommands),
    );

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.deselectTile();
      }
    });
  }

  private selectTile(coord: Coordinates) {
    this.tileSelected.setTilePosition(coord);
    this.world.playSelectEffect(coord);

    TileCommander.selectTile(coord);
    CommandPanelController.changeToTilePanel(coord);
  }

  public deselectTile() {
    this.tileSelected.hide();
    TileCommander.reset();
    CommandPanelController.changeToWorldPanel();
  }

  public clearTiles() {
    this.world.clearTiles();
  }

  public async showConstructableArea() {
    const map = await TileAvailableMapCalculator.calculateConstructableArea();
    this.actionableArea.updateMap(map);
  }

  public async showUnitActionableArea(
    startPosition: Coordinates,
    action: "move" | "move-and-attack" | "ranged-attack",
  ) {
    const map = await TileAvailableMapCalculator.calculateUnitActionableArea(
      action,
      startPosition,
    );
    this.actionableArea.updateMap(map);
  }

  public hideActionableArea() {
    this.actionableArea.clear();
  }
}

export default new GaiaWarController();
