import { GameObject, Sprite } from "@gaiaengine/2d";
import BuildingManager from "../../data/building/BuildingManager.js";

class TileHoverOverlay extends GameObject {
  private buildingPreview: Sprite | undefined;

  constructor() {
    super(-999999, -999999);
    this.append(
      new Sprite(0, 0, "/assets/tile/hover.png"),
    );
  }

  public setPosition(x: number, y: number): this {
    this.zIndex = -y;
    return super.setPosition(x, y);
  }

  public async setBuildingPreview(buildingId: number) {
    const building = await BuildingManager.getBuilding(buildingId);

    this.buildingPreview?.remove();
    this.buildingPreview = new Sprite(0, 0, `/assets/${building.sprites.base}`);
    this.append(this.buildingPreview);
  }

  public clearBuildingPreview() {
    this.buildingPreview?.remove();
    this.buildingPreview = undefined;
  }
}

export default new TileHoverOverlay();
