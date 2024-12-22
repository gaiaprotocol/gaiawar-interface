import { Fadeable, GameObject } from "@gaiaengine/2d";
import GameConfig from "../../config/GaiaWarConfig.js";
import { UnitQuantity } from "../../data/TileData.js";
import SpriteUnit from "./SpriteUnit.js";

export default class UnitGroup extends Fadeable {
  constructor(units: UnitQuantity[], faction: "player" | "enemy") {
    super(0, 0);

    const unitInstances: GameObject[] = [];
    for (const { unitId, quantity } of units) {
      for (let i = 0; i < quantity; i++) {
        unitInstances.push(new SpriteUnit(0, 0, unitId, faction));
        //unitInstances.push(new SpineUnit(0, 0, unitId, faction));
      }
    }

    const totalUnits = unitInstances.length;
    const side = Math.ceil(Math.sqrt(totalUnits));
    const cellSize = GameConfig.tileSize / side;

    let index = 0;
    for (let row = 0; row < side; row++) {
      for (let col = 0; col < side; col++) {
        if (index >= totalUnits) break;

        const unit = unitInstances[index];

        const x = -GameConfig.tileSize / 2 + col * cellSize + cellSize / 2;
        const y = -GameConfig.tileSize / 2 + row * cellSize + cellSize / 2;

        unit.setPosition(x, y);
        this.append(unit);
        index++;
      }
    }

    this.fadeIn(0.2);
  }
}
