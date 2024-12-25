import { WalletLoginManager } from "@common-module/wallet-login";
import { compareCoordinates, Coordinates, SFXPlayer } from "@gaiaengine/2d";
import PendingCommand, {
  PendingCommandType,
} from "../../data/pending-command/PendingCommand.js";
import TileData from "../../data/tile/TileData.js";
import TileFaction from "../../data/tile/TileFaction.js";
import Building from "../building/Building.js";
import Constructing from "../building/Constructing.js";
import Flag from "../flag/Flag.js";
import Loot from "../loot/Loot.js";
import UnitGroup from "../unit/UnitGroup.js";
import TileObject from "./TileObject.js";

export default class Tile extends TileObject {
  private currentData: TileData | undefined;
  private currentFaction: TileFaction = "enemy";

  private building: Building | undefined;
  private loot: Loot;
  private unitGroup: UnitGroup;

  private constructing: Constructing | undefined;
  private flags: Record<string, Flag> = {};

  constructor(private coord: Coordinates) {
    super(coord);
    this.loot = new Loot().appendTo(this);
    this.loot.zIndex = 1;

    this.unitGroup = new UnitGroup().appendTo(this);
    this.unitGroup.zIndex = 2;
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

    this.unitGroup.setUnits(faction, tileData.units);
    this.loot.setLoot(tileData.loot);

    this.currentData = tileData;
    this.currentFaction = faction;
  }

  private createBuilding(faction: TileFaction, buildingId: number) {
    this.constructing?.remove();
    this.constructing = undefined;

    for (const [flagId, flag] of Object.entries(this.flags)) {
      if (
        flag.type === PendingCommandType.CONSTRUCT ||
        flag.type === PendingCommandType.UPGRADE_BUILDING
      ) {
        flag.remove();
        delete this.flags[flagId];
      }
    }

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
      if (
        pendingCommand.type === PendingCommandType.CONSTRUCT ||
        pendingCommand.type === PendingCommandType.UPGRADE_BUILDING
      ) {
        this.destroyBuilding();

        this.constructing?.remove();
        this.constructing = new Constructing().appendTo(this);

        SFXPlayer.play("/assets/sfx/commands/construction/start.wav");
      }

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
      if (
        pendingCommand.type === PendingCommandType.CONSTRUCT ||
        pendingCommand.type === PendingCommandType.UPGRADE_BUILDING
      ) {
        const buildingId = this.currentData?.buildingId ?? 0;
        if (buildingId > 0) {
          this.createBuilding(this.currentFaction, buildingId);
        }

        this.constructing?.remove();
        this.constructing = undefined;
      }

      const flagId = this.makeFlagId(pendingCommand);
      this.flags[flagId]?.remove();
      delete this.flags[flagId];
    }
  }

  public playSelectEffect() {
    this.building?.playSelectEffect();
  }
}
