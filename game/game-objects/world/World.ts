import { GameObject, TileRange } from "@gaiaengine/2d";
import GaiaWarConfig from "../../config/GaiaWarConfig.js";
import Ground from "../ground/Ground.js";

interface WorldOptions {
  onTileRangeChanged: (range: TileRange) => void;
}

export default class World extends GameObject {
  constructor(options: WorldOptions) {
    super(0, 0);
    this.append(
      new Ground({
        extraLoadTileCount: GaiaWarConfig.headquartersSearchRange,
        debounceDelay: 200,
        tileFadeDuration: 0.2,
        onTileRangeChanged: (range) => options.onTileRangeChanged(range),
      }),
    );
  }
}
