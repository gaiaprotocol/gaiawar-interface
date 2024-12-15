import { WalletLoginManager } from "@common-module/wallet-login";
import Building from "./Building.js";
import Constructing from "./Constructing.js";
import TileBase from "./TileBase.js";

export default class Tile extends TileBase {
  private _occupant!: `0x${string}`;
  private _buildingId!: number;

  private constructing: Constructing | undefined;
  private building: Building | undefined;

  constructor(
    private tileX: number,
    private tileY: number,
    occupant: `0x${string}`,
    buildingId: number,
  ) {
    super(tileX, tileY);
    this.setBuilding(occupant, buildingId);
  }

  public setBuilding(occupant: `0x${string}`, buildingId: number) {
    this._occupant = occupant;
    this._buildingId = buildingId;

    this.building?.remove();
    this.building = undefined;

    if (buildingId !== 0) {
      this.building = new Building(
        buildingId,
        occupant === WalletLoginManager.getLoggedInAddress()
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

  public showConstructing() {
    this.constructing?.remove();
    this.constructing = new Constructing().appendTo(this);
  }

  public hideConstructing() {
    this.constructing?.remove();
    this.constructing = undefined;
  }
}
