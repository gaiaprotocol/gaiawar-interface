import { DomNode, el } from "@common-module/app";
import { AppCompConfig } from "@common-module/app-components";
import BuildingData from "../../data/building/BuildingData.js";
import CostList from "../cost/CostList.js";

export default class ConstructionBuildingListItem
  extends DomNode<HTMLDivElement, {
    buildingSelected: (buildingId: number) => Promise<void>;
  }> {
  private loading = false;
  private loadingSpinner: DomNode | undefined;

  constructor(building: BuildingData) {
    super(".construction-building-list-item");
    this.append(
      el("h3", building.name),
      el(
        ".image-container",
        el("img", { src: `/assets/buildings/${building.sprites.base}` }),
      ),
      new CostList(building.constructionCost),
    );

    this.onDom("click", async () => {
      if (this.loading) return;
      this.startLoading();
      await this.emit("buildingSelected", building.id);
      this.stopLoading();
    });
  }

  private startLoading() {
    this.loading = true;
    this.addClass("loading");
    this.loadingSpinner = new AppCompConfig.LoadingSpinner().appendTo(this);
    this.loadingSpinner.on("remove", () => this.loadingSpinner = undefined);
  }

  private stopLoading() {
    this.loading = false;
    this.removeClass("loading");
    this.loadingSpinner?.remove();
  }
}
