import { Fadeable, Sprite } from "@gaiaengine/2d";
import BuildingManager from "../data/building/BuildingManager.js";

export default class Building extends Fadeable {
  constructor(buildingId: number, faction: "player" | "enemy") {
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
}
