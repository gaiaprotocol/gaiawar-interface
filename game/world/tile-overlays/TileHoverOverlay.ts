import { Sprite } from "@gaiaengine/2d";
import BuildingManager from "../../data/building/BuildingManager.js";
import TileBase from "../TileBase.js";

class TileHoverOverlay extends TileBase {
  private buildingPreview: Sprite | undefined;

  constructor() {
    super(-999999, -999999, new Sprite(0, 0, "/assets/tile/hover.png"));
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
