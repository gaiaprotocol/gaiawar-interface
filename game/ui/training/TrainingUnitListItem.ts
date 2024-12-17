import { DomNode, el } from "@common-module/app";
import { AnimatedSprite, GameScreen } from "@gaiaengine/dom";
import UnitData from "../../data/unit/UnitData.js";
import spritesheets from "../../world/unit/unit-spritesheets.json" with {
  type: "json",
};
import CostList from "../cost/CostList.js";

export default class TrainingUnitListItem extends DomNode {
  constructor(unit: UnitData) {
    super(".training-unit-list-item");
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
      new CostList(unit.trainingCosts),
    );
  }
}
