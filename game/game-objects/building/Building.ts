import { Fadeable } from "@gaiaengine/2d";
import TileFaction from "../../data/tile/TileFaction.js";

export default class Building extends Fadeable {
  constructor(faction: TileFaction, buildingId: number) {
    super(0, 0);
  }

  public destroy() {
    //TODO:
    this.remove();
  }
}
