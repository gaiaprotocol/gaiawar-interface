import { Fadeable } from "@gaiaengine/2d";
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

  private createUnit(unitId: number, faction: TileFaction) {
    return new UnitSprite(unitId, faction);
  }

  public setUnits(faction: TileFaction, newUnits: UnitQuantity[]) {
    if (faction !== this.currentFaction) {
      this.currentFaction = faction;
      this.clear();
      this.units = [];

      for (const { unitId, quantity } of newUnits) {
        for (let i = 0; i < quantity; i++) {
          const newUnit = this.createUnit(unitId, faction);
          this.units.push(newUnit);
          this.append(newUnit);
        }
      }

      this.repositionUnits();
      return;
    }

    const newMap = new Map<number, number>();
    for (const { unitId, quantity } of newUnits) {
      newMap.set(unitId, quantity);
    }

    const oldMap = new Map<number, Unit[]>();
    for (const oldUnit of this.units) {
      const arr = oldMap.get(oldUnit.unitId) ?? [];
      arr.push(oldUnit);
      oldMap.set(oldUnit.unitId, arr);
    }

    const updatedUnits: Unit[] = [];

    for (const [unitId, newQuantity] of newMap.entries()) {
      const oldArray = oldMap.get(unitId) ?? [];
      const oldQuantity = oldArray.length;

      if (oldQuantity < newQuantity) {
        updatedUnits.push(...oldArray);
        const diff = newQuantity - oldQuantity;
        for (let i = 0; i < diff; i++) {
          const newUnit = this.createUnit(unitId, faction);
          updatedUnits.push(newUnit);
          this.append(newUnit);
        }
      } else {
        updatedUnits.push(...oldArray.slice(0, newQuantity));
        const toRemove = oldArray.slice(newQuantity);
        for (const obsolete of toRemove) {
          obsolete.remove();
        }
      }

      oldMap.delete(unitId);
    }

    for (const oldArray of oldMap.values()) {
      for (const obsolete of oldArray) {
        obsolete.remove();
      }
    }

    this.units = updatedUnits;
    this.repositionUnits();
  }

  private repositionUnits() {
    const totalUnits = this.units.length;
    if (totalUnits === 0) return;

    const side = Math.ceil(Math.sqrt(totalUnits));
    const cellSize = GaiaWarConfig.tileSize / side;

    let index = 0;
    for (let row = 0; row < side; row++) {
      for (let col = 0; col < side; col++) {
        if (index >= totalUnits) break;
        const unit = this.units[index];

        const x = -GaiaWarConfig.tileSize / 2 + col * cellSize + cellSize / 2;
        const y = -GaiaWarConfig.tileSize / 2 + row * cellSize + cellSize / 2;
        unit.setPosition(x, y);

        index++;
      }
    }
  }

  public playIdleAnimation() {
    for (const unit of this.units) {
      unit.playIdleAnimation();
    }
  }

  public playMoveAnimation(x: number, y: number, units: UnitQuantity[]) {
    for (const { unitId, quantity } of units) {
      let needed = quantity;
      for (const unit of this.units) {
        if (unit.unitId === unitId) {
          unit.playMoveAnimation(x, y);
          needed--;
          if (needed <= 0) {
            break;
          }
        }
      }
    }
  }

  public playRangedAttackAnimation(units: UnitQuantity[]) {
    for (const { unitId, quantity } of units) {
      let needed = quantity;
      for (const unit of this.units) {
        if (unit.unitId === unitId) {
          unit.playRangedAttackAnimation();
          needed--;
          if (needed <= 0) {
            break;
          }
        }
      }
    }
  }
}
