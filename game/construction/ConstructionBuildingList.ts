import { DomNode } from "@common-module/app";
import Building from "../building/Building.js";
import ConstructionBuildingListItem from "./ConstructionBuildingListItem.js";

export default class ConstructionBuildingList extends DomNode<HTMLDivElement, {
  buildingSelected: (buildingId: number) => void;
}> {
  constructor(buildings?: Building[]) {
    super(".construction-building-list");
    if (buildings) this.setBuildings(buildings);
  }

  public setBuildings(buildings: Building[]) {
    this.clear();
    for (const building of buildings) {
      this.addBuilding(building);
    }
  }

  public addBuilding(building: Building) {
    const item = new ConstructionBuildingListItem(building).appendTo(this);
    item.onDom("click", () => this.emit("buildingSelected", building.id));
  }
}
