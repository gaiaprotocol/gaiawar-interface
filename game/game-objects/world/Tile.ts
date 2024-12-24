import { WalletLoginManager } from "@common-module/wallet-login";
import { compareCoordinates, Coordinates } from "@gaiaengine/2d";
import PendingCommand from "../../data/pending-command/PendingCommand.js";
import TileData from "../../data/tile/TileData.js";
import TileFaction from "../../data/tile/TileFaction.js";
import Building from "../building/Building.js";
import Flag from "../flag/Flag.js";
import Loot from "../loot/Loot.js";
import UnitPlatoon from "../unit/UnitPlatoon.js";
import TileObject from "./TileObject.js";

export default class Tile extends TileObject {
  private currentData: TileData | undefined;
  private currentFaction: TileFaction = "enemy";

  private building: Building | undefined;
  private unitPlatoon: UnitPlatoon;
  private loot: Loot;

  private flags: Record<string, Flag> = {};

  constructor(private coord: Coordinates) {
    super(coord);
    this.unitPlatoon = new UnitPlatoon().appendTo(this);
    this.loot = new Loot().appendTo(this);
  }

  public setData(tileData: TileData) {
    const user = WalletLoginManager.getLoggedInAddress();
    const faction = tileData.occupant === user ? "player" : "enemy";

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
    this.building?.destroy();
    this.building = new Building(faction, buildingId).appendTo(this);
  }

  private destroyBuilding() {
    this.building?.destroy();
    this.building = undefined;
  }

  private makeFlagId(pendingCommand: PendingCommand) {
    let id = `${pendingCommand.user}:${pendingCommand.type}`;
    if (pendingCommand.from) {
      id += `-${pendingCommand.from.x},${pendingCommand.from.y}`;
    } else if (pendingCommand.to) {
      id += `-${pendingCommand.to.x},${pendingCommand.to.y}`;
    }
    return id;
  }

  public addPendingCommand(pendingCommand: PendingCommand) {
    if (compareCoordinates(pendingCommand.from, this.coord)) {
      //TODO:
    }

    if (compareCoordinates(pendingCommand.to, this.coord)) {
      const user = WalletLoginManager.getLoggedInAddress();
      const faction = pendingCommand.user === user ? "player" : "enemy";
      const flag = new Flag(faction, pendingCommand.type).appendTo(this);
      this.flags[this.makeFlagId(pendingCommand)] = flag;
    }
  }

  public removePendingCommand(pendingCommand: PendingCommand) {
    if (compareCoordinates(pendingCommand.from, this.coord)) {
      //TODO:
    }

    if (compareCoordinates(pendingCommand.to, this.coord)) {
      delete this.flags[this.makeFlagId(pendingCommand)];
    }
  }
}
