import { Coordinates, GameObject } from "@gaiaengine/2d";
import BattlegroundContract from "../contracts/BattlegroundContract.js";
import Ground from "./ground/Ground.js";

class World extends GameObject {
  constructor() {
    super(0, 0);
    this.append(
      new Ground({
        onLoadTiles: (coordinates) => {
          console.log("Loaded tiles:", coordinates);
          this.loadTiles(coordinates);
        },
        onDeleteTiles: (coordinates) => {
          console.log("Deleted tiles:", coordinates);
        },
      }),
    );
  }

  private async loadTiles(coordinates: Coordinates[]) {
    const tiles = await BattlegroundContract.getTiles(coordinates);
    console.log(tiles);
  }
}

export default new World();
