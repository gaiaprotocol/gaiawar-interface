import { GameObject } from "@gaiaengine/2d";
import Ground from "./ground/Ground.js";

class World extends GameObject {
  constructor() {
    super(0, 0);
    this.append(
      new Ground({
        onTileRangeChanged: (tileRange) => {
          console.log(tileRange);
        },
      }),
    );
  }
}

export default new World();
