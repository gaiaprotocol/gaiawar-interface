import { GameObject, Sprite } from "@gaiaengine/2d";
import BuildingManager from "../data/building/BuildingManager.js";

export default class Building extends GameObject {
  constructor(private buildingId: number, private faction: "player" | "enemy") {
    super(0, 0);
    this.loadImage();
  }

  private async loadImage() {
    const building = await BuildingManager.getBuilding(this.buildingId);
    this.append(
      new Sprite(0, 0, `/assets/${building.sprites.base}`),
      new Sprite(0, 0, `/assets/${building.sprites[this.faction]}`),
    );
  }
}
