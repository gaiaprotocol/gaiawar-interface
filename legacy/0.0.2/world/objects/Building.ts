import { GameObject } from "@gaiaengine/2d";
import GameConfig from "../../GameConfig.js";

export default class Building extends GameObject {
  constructor(tileX: number, tileY: number) {
    super(tileX * GameConfig.tileSize, tileY * GameConfig.tileSize);
  }
}
