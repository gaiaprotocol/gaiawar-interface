import { DomNode } from "@common-module/app";
import BuildingData from "../building/BuildingData.js";
import ConstructionBuildingListItem from "./ConstructionBuildingListItem.js";

export default class ConstructionBuildingList extends DomNode<HTMLDivElement, {
  buildingSelected: (buildingId: number) => void;
}> {
  constructor(buildings?: BuildingData[]) {
    super(".construction-building-list");
    if (buildings) this.setBuildings(buildings);
  }

  public setBuildings(buildings: BuildingData[]) {
    this.clear();
    for (const building of buildings) {
      this.addBuilding(building);
    }
  }

  public addBuilding(building: BuildingData) {
    const item = new ConstructionBuildingListItem(building).appendTo(this);
    item.onDom("click", () => this.emit("buildingSelected", building.id));
  }
}
