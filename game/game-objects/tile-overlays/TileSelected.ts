import { Sprite } from "@gaiaengine/2d";
import TileObject from "../world/TileObject.js";

export default class TileSelected extends TileObject {
  constructor() {
    super(
      { x: -999999, y: -999999 },
      new Sprite(0, 0, "/assets/tile/selected.png"),
    );
  }
}
