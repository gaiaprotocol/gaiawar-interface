import { Fadeable, Sprite } from "@gaiaengine/2d";
import BuildingManager from "../../data/building/BuildingManager.js";
import TileFaction from "../../data/tile/TileFaction.js";

export default class Building extends Fadeable {
  constructor(faction: TileFaction, buildingId: number) {
    super(0, 0);
    const metadata = BuildingManager.getBuildingMetadata(buildingId);
    if (metadata) {
      this.append(
        new Sprite(0, 0, `/assets/${metadata.sprites.base}`),
        new Sprite(0, 0, `/assets/${metadata.sprites[faction]}`),
      );
      this.fadeIn(0.2);
    }
  }

  public destroy() {
    //TODO:
    this.remove();
  }
}
