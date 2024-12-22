import { Sprite } from "@gaiaengine/2d";
import TileBase from "../TileBase.js";

class TileSelectedOverlay extends TileBase {
  constructor() {
    super(-999999, -999999, new Sprite(0, 0, "/assets/tile/selected.png"));
  }
}

export default new TileSelectedOverlay();
