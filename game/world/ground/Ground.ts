import { RectTerrainMap } from "@gaiaengine/2d";
import mapData from "./map.json" assert { type: "json" };
import spritesheetWithAlphaData from "./spritesheet-with-alpha.json" assert {
  type: "json",
};
import spritesheetWithoutAlphaData from "./spritesheet-without-alpha.json" assert {
  type: "json",
};

export default class Ground extends RectTerrainMap {
  constructor() {
    super(
      256,
      {
        "spritesheet-with-alpha": {
          src: "/assets/map/spritesheet-with-alpha.png",
          atlas: spritesheetWithAlphaData,
        },
        "spritesheet-without-alpha": {
          src: "/assets/map/spritesheet-without-alpha.jpg",
          atlas: spritesheetWithoutAlphaData,
        },
      },
      mapData.terrains,
      mapData.objects,
      mapData.terrainMap,
      mapData.mapObjects,
    );
  }
}
