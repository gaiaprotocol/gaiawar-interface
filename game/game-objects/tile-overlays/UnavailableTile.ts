import { Coordinates, RectangleNode } from "@gaiaengine/2d";
import GameConfig from "../../config/GaiaWarConfig.js";
import PulsingTile from "./PulsingTile.js";

export default class UnavailableTile extends PulsingTile {
  private currentScale: number | undefined;
  private rect: RectangleNode;

  constructor(coord: Coordinates) {
    super(coord);
    this.rect = new RectangleNode(
      0,
      0,
      GameConfig.tileSize,
      GameConfig.tileSize,
      { color: 0xff0000, alpha: 0.16 },
      { width: 1, color: 0xff0000 },
    );
    this.append(this.rect);
  }

  protected update(deltaTime: number): void {
    if (this.screen) {
      const newScale = this.screen.camera.scale;
      if (newScale !== this.currentScale) {
        this.currentScale = this.screen.camera.scale;
        this.rect.stroke = {
          width: 1 / this.screen.camera.scale,
          color: 0xff0000,
        };
      }
    }
    super.update(deltaTime);
  }
}
