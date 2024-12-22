import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import TileData from "../../data/tile/TileData.js";
import TileFaction from "../../data/tile/TileFaction.js";
import Building from "../building/Building.js";
import UnitPlatoon from "../unit/UnitPlatoon.js";
import Loot from "./Loot.js";
import TileObject from "./TileObject.js";

export default class Tile extends TileObject {
  private currentData: TileData | undefined;
  private currentFaction: TileFaction = "enemy";

  private building: Building | undefined;
  private unitPlatoon: UnitPlatoon;
  private loot: Loot;

  constructor(coord: Coordinates) {
    super(coord);
    this.unitPlatoon = new UnitPlatoon().appendTo(this);
    this.loot = new Loot().appendTo(this);
  }

  public setData(tileData: TileData) {
    const loginUser = WalletLoginManager.getLoggedInAddress();
    const faction = tileData.occupant === loginUser ? "player" : "enemy";

    if (this.building && !tileData.buildingId) {
      this.destroyBuilding();
    } else if (
      this.currentData?.buildingId !== tileData.buildingId ||
      (this.currentFaction !== faction && tileData.buildingId)
    ) {
      this.createBuilding(faction, tileData.buildingId);
    }

    this.unitPlatoon.setUnits(faction, tileData.units);
    this.loot.setLoot(tileData.loot);

    this.currentData = tileData;
    this.currentFaction = faction;
  }

  private createBuilding(faction: TileFaction, buildingId: number) {
    this.building?.destroy();
    this.building = new Building(faction, buildingId);
  }

  private destroyBuilding() {
    this.building?.destroy();
    this.building = undefined;
  }
}
