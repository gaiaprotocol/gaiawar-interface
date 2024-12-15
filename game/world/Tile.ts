import { GameObject } from "@gaiaengine/2d";
import Building from "./Building.js";

export default class Tile extends GameObject {
  constructor(info: { occupant: `0x${string}`; buildingId: number }) {
    super(0, 0);
    if (info.buildingId !== 0) {
      this.append(new Building(info.buildingId));
    }
  }
}
