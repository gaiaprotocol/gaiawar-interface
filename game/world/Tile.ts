import { WalletLoginManager } from "@common-module/wallet-login";
import { GameObject } from "@gaiaengine/2d";
import TileData, { UnitQuantity } from "../data/TileData.js";
import Building from "./Building.js";
import Constructing from "./Constructing.js";
import TrainingFlag from "./flags/TrainingFlag.js";
import TileBase from "./TileBase.js";
import UnitGroup from "./unit/UnitGroup.js";

export default class Tile extends TileBase {
  private _owner!: `0x${string}`;
  private _buildingId!: number;

  private progressObject: GameObject | undefined;
  private building: Building | undefined;
  private unitGroup: UnitGroup | undefined;

  constructor(
    private tileX: number,
    private tileY: number,
    public data: TileData,
  ) {
    super(tileX, tileY);
    this.setBuilding(data.owner, data.buildingId);
    this.setUnitGroup(data.units);
  }

  public setBuilding(owner: `0x${string}`, buildingId: number) {
    this._owner = owner;
    this._buildingId = buildingId;

    this.building?.remove();
    this.building = undefined;

    if (buildingId !== 0) {
      this.building = new Building(
        buildingId,
        owner === WalletLoginManager.getLoggedInAddress() ? "player" : "enemy",
      ).appendTo(this);
    }
  }

  public setUnitGroup(units: UnitQuantity[]) {
    this.unitGroup?.remove();

    if (units.length > 0) {
      this.unitGroup = new UnitGroup(
        units,
        this._owner === WalletLoginManager.getLoggedInAddress()
          ? "player"
          : "enemy",
      ).appendTo(this);
    }
  }

  public getTileX() {
    return this.tileX;
  }

  public getTileY() {
    return this.tileY;
  }

  public getOwner() {
    return this._owner;
  }

  public getBuildingId() {
    return this._buildingId;
  }

  public showConstructing(faction: "player" | "enemy") {
    this.building?.remove();
    this.building = undefined;

    this.progressObject?.remove();
    this.progressObject = new Constructing(faction).appendTo(this);
  }

  public showTraining(faction: "player" | "enemy") {
    this.building?.remove();
    this.building = undefined;

    this.progressObject?.remove();
    this.progressObject = new TrainingFlag(faction).appendTo(this);
  }

  public hideProgressObject() {
    this.setBuilding(this._owner, this._buildingId);

    this.progressObject?.remove();
    this.progressObject = undefined;
  }
}
