import { WalletLoginManager } from "@common-module/wallet-login";
import Building from "./Building.js";
import TileBase from "./TileBase.js";

export default class Tile extends TileBase {
  constructor(
    private tileX: number,
    private tileY: number,
    private info: { occupant: `0x${string}`; buildingId: number },
  ) {
    super(tileX, tileY);
    if (info.buildingId !== 0) {
      this.append(
        new Building(
          info.buildingId,
          info.occupant === WalletLoginManager.getLoggedInAddress()
            ? "player"
            : "enemy",
        ),
      );
    }
  }

  public getTileX() {
    return this.tileX;
  }

  public getTileY() {
    return this.tileY;
  }

  public getOccupant() {
    return this.info.occupant;
  }

  public getBuildingId() {
    return this.info.buildingId;
  }
}
