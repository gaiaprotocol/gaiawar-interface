import { DomNode, el } from "@common-module/app";
import { WalletLoginManager } from "@common-module/wallet-login";
import { zeroAddress } from "viem";
import TileData from "../../data/tile/TileData.js";

export default class WorldMap extends DomNode<HTMLDivElement, {
  tileSelected: (coordinates: { x: number; y: number }) => void;
}> {
  public static readonly WORLDMAP_SIZE = 2000;
  public static readonly TILE_SIZE = WorldMap.WORLDMAP_SIZE / 100;

  private canvas: DomNode<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  private tiles: TileData[] = [];

  constructor() {
    super(".world-map");
    this.canvas = el("canvas", {
      width: WorldMap.WORLDMAP_SIZE,
      height: WorldMap.WORLDMAP_SIZE,
    }).appendTo(this);

    this.ctx = this.canvas.htmlElement.getContext("2d")!;

    this.canvas.onDom("click", (event) => {
      const rect = this.canvas.htmlElement.getBoundingClientRect();
      const x = Math.floor((event.clientX - rect.left) / WorldMap.TILE_SIZE);
      const y = Math.floor((event.clientY - rect.top) / WorldMap.TILE_SIZE);

      this.drawMap();
      this.ctx.strokeStyle = "aqua";
      this.ctx.strokeRect(
        x * WorldMap.TILE_SIZE - 0.5,
        y * WorldMap.TILE_SIZE - 0.5,
        WorldMap.TILE_SIZE,
        WorldMap.TILE_SIZE,
      );

      this.emit("tileSelected", { x: x - 50, y: y - 50 });
    });
  }

  public setTiles(tiles: TileData[]) {
    this.tiles = tiles;
    this.drawMap();
  }

  private drawMap() {
    this.ctx.clearRect(0, 0, WorldMap.WORLDMAP_SIZE, WorldMap.WORLDMAP_SIZE);

    const user = WalletLoginManager.getLoggedInAddress();

    for (const [index, tile] of this.tiles.entries()) {
      const y = index % 100;
      const x = Math.floor(index / 100);

      if (tile.occupant === zeroAddress) {
        this.ctx.fillStyle = "gray";
      } else if (tile.occupant === user) {
        this.ctx.fillStyle = "green";
      } else {
        this.ctx.fillStyle = "red";
      }

      this.ctx.fillRect(
        x * WorldMap.TILE_SIZE,
        y * WorldMap.TILE_SIZE,
        WorldMap.TILE_SIZE - 0.5,
        WorldMap.TILE_SIZE - 0.5,
      );
    }
  }
}
