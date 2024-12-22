import { Fadeable } from "@gaiaengine/2d";
import { UnitQuantity } from "../../data/tile/TileData.js";
import TileFaction from "../../data/tile/TileFaction.js";

export default class UnitPlatoon extends Fadeable {
  private currentFaction: TileFaction = "enemy";
  private currentUnits: UnitQuantity[] = [];

  constructor() {
    super(0, 0);
  }

  public setUnits(faction: TileFaction, units: UnitQuantity[]) {
  }
}
