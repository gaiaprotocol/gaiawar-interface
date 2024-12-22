import { ShapeNode, Sprite } from "@gaiaengine/2d";
import { StrokeInput } from "../../../../pixi.js/lib/index.js";
import GameConfig from "../../config/GaiaWarConfig.js";
import BuildingManager from "../../data/building/BuildingManager.js";
import TileBase from "../TileBase.js";

class TargetingShape extends ShapeNode {
  private _stroke: StrokeInput | undefined;
  private currentScale: number | undefined;

  constructor() {
    super(0, 0);
  }

  protected draw(): void {
    this.container.clear();

    const tileSize = GameConfig.tileSize;
    const half = tileSize / 2;

    this.container.moveTo(-half, -half + tileSize / 3)
      .lineTo(-half, -half)
      .lineTo(-half + tileSize / 3, -half);

    this.container.moveTo(tileSize - tileSize / 3 - half, -half)
      .lineTo(tileSize - half, -half)
      .lineTo(tileSize - half, -half + tileSize / 3);

    this.container.moveTo(tileSize - half, tileSize - tileSize / 3 - half)
      .lineTo(tileSize - half, tileSize - half)
      .lineTo(tileSize - tileSize / 3 - half, tileSize - half);

    this.container.moveTo(-half + tileSize / 3, tileSize - half)
      .lineTo(-half, tileSize - half)
      .lineTo(-half, tileSize - tileSize / 3 - half);

    this.container.stroke(this._stroke);
  }

  public set stroke(stroke: StrokeInput | undefined) {
    this._stroke = stroke;
    this.draw();
  }

  public get stroke() {
    return this._stroke;
  }

  protected update(deltaTime: number): void {
    if (this.screen) {
      const newScale = this.screen.camera.scale;
      if (newScale !== this.currentScale) {
        this.currentScale = newScale;

        this.stroke = {
          width: 1 / this.currentScale,
          color: 0x48D1CC,
        };
      }
    }
    super.update(deltaTime);
  }
}

class TileHoverOverlay extends TileBase {
  private buildingPreview: Sprite | undefined;

  constructor() {
    super(-999999, -999999, new TargetingShape());
  }

  public async setBuildingPreview(buildingId: number) {
    const metadata = BuildingManager.getBuildingMetadata(buildingId);
    if (metadata) {
      this.buildingPreview?.remove();
      this.buildingPreview = new Sprite(
        0,
        0,
        `/assets/${metadata.sprites.base}`,
      );
      this.append(this.buildingPreview);
    }
  }

  public clearBuildingPreview() {
    this.buildingPreview?.remove();
    this.buildingPreview = undefined;
  }
}

export default new TileHoverOverlay();
