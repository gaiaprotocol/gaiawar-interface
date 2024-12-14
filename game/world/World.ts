import { GameObject, RectTerrainMapOptions } from "@gaiaengine/2d";
import Ground from "./ground/Ground.js";

export default class World extends GameObject {
  constructor(options: RectTerrainMapOptions) {
    super(0, 0);
    this.append(new Ground(options));
  }
}
