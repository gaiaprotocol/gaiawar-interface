import { Fadeable, GameObject } from "@gaiaengine/2d";
import GaiaWarConfig from "../../config/GaiaWarConfig.js";
import { UnitQuantity } from "../../data/tile/TileData.js";
import TileFaction from "../../data/tile/TileFaction.js";
import Unit from "./Unit.js";
import UnitSprite from "./UnitSprite.js";

export default class UnitGroup extends Fadeable {
  private currentFaction: TileFaction = "enemy";
  private units: Unit[] = [];

  constructor() {
    super(0, 0);
  }

  //TODO: Implement this method
  public setUnits(faction: TileFaction, units: UnitQuantity[]) {
    this.clear();

    const unitInstances: GameObject[] = [];
    for (const { unitId, quantity } of units) {
      for (let i = 0; i < quantity; i++) {
        unitInstances.push(new UnitSprite(unitId, faction));
        //unitInstances.push(new UnitSpine(unitId, faction));
      }
    }

    const totalUnits = unitInstances.length;
    const side = Math.ceil(Math.sqrt(totalUnits));
    const cellSize = GaiaWarConfig.tileSize / side;

    let index = 0;
    for (let row = 0; row < side; row++) {
      for (let col = 0; col < side; col++) {
        if (index >= totalUnits) break;

        const unit = unitInstances[index];

        const x = -GaiaWarConfig.tileSize / 2 + col * cellSize + cellSize / 2;
        const y = -GaiaWarConfig.tileSize / 2 + row * cellSize + cellSize / 2;

        unit.setPosition(x, y);
        this.append(unit);
        index++;
      }
    }
  }
}
