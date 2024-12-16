import { WalletLoginManager } from "@common-module/wallet-login";
import Building from "./Building.js";
import Constructing from "./Constructing.js";
import TileBase from "./TileBase.js";

export default class Tile extends TileBase {
  private _owner!: `0x${string}`;
  private _buildingId!: number;

  private constructing: Constructing | undefined;
  private building: Building | undefined;

  constructor(
    private tileX: number,
    private tileY: number,
    owner: `0x${string}`,
    buildingId: number,
  ) {
    super(tileX, tileY);
    this.setBuilding(owner, buildingId);
  }

  public setBuilding(owner: `0x${string}`, buildingId: number) {
    this._owner = owner;
    this._buildingId = buildingId;

    this.building?.remove();
    this.building = undefined;

    if (buildingId !== 0) {
      this.building = new Building(
        buildingId,
        owner === WalletLoginManager.getLoggedInAddress()
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

  public showConstructing() {
    this.constructing?.remove();
    this.constructing = new Constructing().appendTo(this);
  }

  public hideConstructing() {
    this.constructing?.remove();
    this.constructing = undefined;
  }
}
