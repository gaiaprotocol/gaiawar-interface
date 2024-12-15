import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates, GameObject, TileRange } from "@gaiaengine/2d";
import { zeroAddress } from "viem";
import BattlegroundContract from "../contracts/BattlegroundContract.js";
import BuildingManager from "../data/building/BuildingManager.js";
import GameConfig from "../GameConfig.js";
import Ground from "./ground/Ground.js";
import BuildableTileOverlay from "./tile-overlays/BuildableTileOverlay.js";
import UnbuildableTileOverlay from "./tile-overlays/UnbuildableTileOverlay.js";
import Tile from "./Tile.js";

class World extends GameObject {
  private buildableOverlayContainer = new GameObject(0, 0);
  private tileContainer = new GameObject(0, 0);
  private tiles: { [key: string]: Tile } = {};
  private tileRange: TileRange = { startX: 0, startY: 0, endX: 0, endY: 0 };

  constructor() {
    super(0, 0);
    this.append(
      new Ground({
        extraTileLoadWidth: GameConfig.headquartersSearchRange *
          GameConfig.tileSize,
        extraTileLoadHeight: GameConfig.headquartersSearchRange *
          GameConfig.tileSize,
        onLoadTiles: (coordinates) => this.loadTiles(coordinates),
        onDeleteTiles: (coordinates) => this.deleteTiles(coordinates),
        onTileRangeChanged: (range) => this.tileRange = range,
      }),
      this.buildableOverlayContainer,
      this.tileContainer,
    );
  }

  private async loadTiles(coordinates: Coordinates[]) {
    const tileInfoSet = await BattlegroundContract.getTiles(coordinates);
    for (const [index, c] of coordinates.entries()) {
      const tileInfo = tileInfoSet[index];
      const key = `${c.x},${c.y}`;
      const tile = new Tile(c.x, c.y, tileInfo);
      this.tiles[key] = tile;
      this.tileContainer.append(tile);
    }
    this.showBuildableAreas();
  }

  private deleteTiles(coordinates: Coordinates[]) {
    for (const c of coordinates) {
      const key = `${c.x},${c.y}`;
      const tile = this.tiles[key];
      if (tile) {
        tile.remove();
        delete this.tiles[key];
      }
    }
  }

  public async showBuildableAreas() {
    this.clearBuildableAreas();

    const walletAddress = WalletLoginManager.getLoggedInAddress();
    if (walletAddress) {
      const hasHeadquarters = await BattlegroundContract.hasHeadquarters(
        walletAddress,
      );

      if (hasHeadquarters) {
        for (const tile of Object.values(this.tiles)) {
          if (tile.getOccupant() === walletAddress) {
            const constructionRange = BuildingManager.getConstructionRange(
              tile.getBuildingId(),
            );
            for (let x = -constructionRange; x <= constructionRange; x++) {
              for (let y = -constructionRange; y <= constructionRange; y++) {
                const tileX = tile.getTileX() + x;
                const tileY = tile.getTileY() + y;
                new BuildableTileOverlay(tileX, tileY).appendTo(
                  this.buildableOverlayContainer,
                );
              }
            }
          }
        }
      } else {
        for (const tile of Object.values(this.tiles)) {
          if (
            tile.getOccupant() !== zeroAddress &&
            tile.getOccupant() !== walletAddress
          ) {
            for (
              let x = -GameConfig.enemyBuildingSearchRange;
              x <= GameConfig.enemyBuildingSearchRange;
              x++
            ) {
              for (
                let y = -GameConfig.enemyBuildingSearchRange;
                y <= GameConfig.enemyBuildingSearchRange;
                y++
              ) {
                const tileX = tile.getTileX() + x;
                const tileY = tile.getTileY() + y;
                new UnbuildableTileOverlay(tileX, tileY).appendTo(
                  this.buildableOverlayContainer,
                );
              }
            }
          }
        }
      }
    }
  }

  public clearBuildableAreas() {
    this.buildableOverlayContainer.clear();
  }
}

export default new World();
