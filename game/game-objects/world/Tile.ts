import { Coordinates } from "@gaiaengine/2d";
import TileData from "../../data/tile/TileData.js";
import TileObject from "./TileObject.js";

export default class Tile extends TileObject {
  private currentData: TileData | undefined;

  constructor(coord: Coordinates) {
    super(coord);
  }

  public setData(tileData: TileData) {
    //TODO:
  }
}
