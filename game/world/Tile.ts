import { WalletLoginManager } from "@common-module/wallet-login";
import { GameObject } from "@gaiaengine/2d";
import TileData, { UnitQuantity } from "../data/TileData.js";
import Building from "./Building.js";
import Constructing from "./Constructing.js";
import TrainingFlag from "./flags/TrainingFlag.js";
import TileBase from "./TileBase.js";
import UnitGroup from "./unit/UnitGroup.js";

export default class Tile extends TileBase {
  private _occupant!: `0x${string}`;
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
    this.setBuilding(data.occupant, data.buildingId);
    this.setUnitGroup(data.units);
  }

  public setBuilding(occupant: `0x${string}`, buildingId: number) {
    this._occupant = occupant;
    this._buildingId = buildingId;

    this.building?.remove();
    this.building = undefined;

    if (buildingId !== 0) {
      this.building = new Building(
        buildingId,
        occupant === WalletLoginManager.getLoggedInAddress() ? "player" : "enemy",
      ).appendTo(this);
    }
  }

  public setUnitGroup(units: UnitQuantity[]) {
    this.unitGroup?.remove();

    if (units.length > 0) {
      this.unitGroup = new UnitGroup(
        units,
        this._occupant === WalletLoginManager.getLoggedInAddress()
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

  public getOccupant() {
    return this._occupant;
  }

  public getBuildingId() {
    return this._buildingId;
  }

  public getUnits() {
    return this.data.units;
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
    this.setBuilding(this._occupant, this._buildingId);

    this.progressObject?.remove();
    this.progressObject = undefined;
  }
}
