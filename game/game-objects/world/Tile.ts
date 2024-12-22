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

  constructor(private coord: Coordinates) {
    super(coord);
    this.unitPlatoon = new UnitPlatoon().appendTo(this);
    this.loot = new Loot().appendTo(this);
  }

  public setData(tileData: TileData) {
    const loginUser = WalletLoginManager.getLoggedInAddress();
    const faction = tileData.occupant === loginUser ? "player" : "enemy";

    if (this.building && tileData.buildingId === 0) {
      this.destroyBuilding();
    } else if (
      tileData.buildingId > 0 && (
        this.currentData?.buildingId !== tileData.buildingId ||
        (this.currentFaction !== faction && tileData.buildingId > 0)
      )
    ) {
      this.createBuilding(faction, tileData.buildingId);
    }

    this.unitPlatoon.setUnits(faction, tileData.units);
    this.loot.setLoot(tileData.loot);

    this.currentData = tileData;
    this.currentFaction = faction;
  }

  private createBuilding(faction: TileFaction, buildingId: number) {
    console.log("createBuilding", this.coord, faction, buildingId);

    this.building?.destroy();
    this.building = new Building(faction, buildingId).appendTo(this);
  }

  private destroyBuilding() {
    this.building?.destroy();
    this.building = undefined;
  }
}
