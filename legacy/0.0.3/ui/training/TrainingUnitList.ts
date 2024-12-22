import { DomNode } from "@common-module/app";
import UnitData from "../../data/unit/UnitData.js";
import TrainingUnitListItem from "./TrainingUnitListItem.js";

export default class TrainingUnitList extends DomNode<HTMLDivElement, {
  unitSelected: (unitId: number) => void;
}> {
  constructor(units?: UnitData[]) {
    super(".training-unit-list");
    if (units) this.setUnits(units);
  }

  public setUnits(units: UnitData[]) {
    this.clear();
    for (const unit of units) {
      this.addUnit(unit);
    }
  }

  public addUnit(unit: UnitData) {
    const item = new TrainingUnitListItem(unit).appendTo(this);
    item.onDom("click", () => this.emit("unitSelected", unit.id));
  }
}
