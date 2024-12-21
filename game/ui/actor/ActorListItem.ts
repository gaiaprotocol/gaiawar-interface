import { DomNode, el } from "@common-module/app";
import { AnimatedSprite, GameScreen } from "@gaiaengine/dom";
import BuildingManager from "../../data/building/BuildingManager.js";
import UnitManager from "../../data/unit/UnitManager.js";
import spritesheets from "../../world/unit/unit-spritesheets.json" with {
  type: "json",
};
import CostList from "../cost/CostList.js";
import Actor from "./Actor.js";
import ActorMode from "./ActorMode.js";

export default class ActorListItem extends DomNode<HTMLDivElement, {
  proceed: () => void;
}> {
  constructor(private mode: ActorMode, private actor: Actor) {
    super(".actor-list-item");
    this.loadActor();
  }

  private async loadActor() {
    if (this.actor.type === "building") {
      const building = await BuildingManager.getBuilding(this.actor.buildingId);
      this.append(
        el("h3", building.name),
        el(
          ".image-container",
          el("img", { src: `/assets/${building.sprites.base}` }),
        ),
        new CostList(building.constructionCost),
      );
    }

    if (this.actor.type === "unit") {
      const unit = await UnitManager.getUnit(this.actor.unitId);
      this.append(
        el("h3", unit.name),
        el(
          ".preview-container",
          new GameScreen(
            186,
            186,
            new AnimatedSprite(
              0,
              0,
              `/assets/units/sprites/${unit.key}/player/idle.png`,
              (spritesheets as any)[unit.key].idle,
              "idle",
              24,
            ),
          ),
        ),
        new CostList(unit.trainingCost),
      );
    }

    this.onDom("click", () => {
      this.emit("proceed");
    });
  }
}
