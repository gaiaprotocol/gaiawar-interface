import { RectMap, RectMapOptions } from "@gaiaengine/2d";
import GameConfig from "../../config/GaiaWarConfig.js";
import mapData from "./map.json" with { type: "json" };

export default class Ground extends RectMap {
  constructor(options: RectMapOptions) {
    super(
      GameConfig.tileSize,
      {
        "spritesheet-with-alpha": "/assets/map/spritesheet-with-alpha.png",
        "spritesheet-without-alpha":
          "/assets/map/spritesheet-without-alpha.jpg",
      },
      mapData,
      options,
    );
  }
}
