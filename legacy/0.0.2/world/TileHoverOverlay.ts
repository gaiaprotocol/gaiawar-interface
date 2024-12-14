import { GameObject, Sprite } from "@gaiaengine/2d";

export default class TileHoverOverlay extends GameObject {
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

  public setBuildingPreview(building: Sprite) {
    this.buildingPreview?.remove();
    this.buildingPreview = building;
    this.append(building);
  }

  public clearBuildingPreview() {
    this.buildingPreview?.remove();
    this.buildingPreview = undefined;
  }
}
