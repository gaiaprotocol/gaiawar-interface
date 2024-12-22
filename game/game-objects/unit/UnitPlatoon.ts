import { Fadeable } from "@gaiaengine/2d";
import { UnitQuantity } from "../../data/tile/TileData.js";
import TileFaction from "../../data/tile/TileFaction.js";
import UnitSquad from "./UnitSquad.js";

export default class UnitPlatoon extends Fadeable {
  private currentFaction: TileFaction = "enemy";
  private squads: UnitSquad[] = [];

  constructor() {
    super(0, 0);
  }

  public setUnits(faction: TileFaction, units: UnitQuantity[]) {
    //TODO:
  }
}
