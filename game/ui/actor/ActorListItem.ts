import { DomNode, el } from "@common-module/app";
import { Button, ButtonType } from "@common-module/app-components";
import { Coordinates } from "@gaiaengine/2d";
import { AnimatedSprite, GameScreen } from "@gaiaengine/dom";
import BuildingManager from "../../data/building/BuildingManager.js";
import UnitManager from "../../data/unit/UnitManager.js";
import spritesheets from "../../game-objects/unit/unit-spritesheets.json" with {
  type: "json"
};
import UpgradeBuildingModal from "../construction/UpgradeBuildingModal.js";
import CostList from "../cost/CostList.js";
import Actor from "./Actor.js";
import ActorMode from "./ActorMode.js";

export default class ActorListItem extends DomNode<HTMLDivElement, {
  proceed: () => void;
}> {
  constructor(
    private mode: ActorMode,
    private coordinates: Coordinates,
    private actor: Actor,
  ) {
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

      if (this.mode === "upgrade") {
        this.append(
          new Button({
            type: ButtonType.Contained,
            title: "Upgrade",
            onClick: () => {
              if (this.actor.type === "building") {
                new UpgradeBuildingModal(
                  this.coordinates,
                  this.actor.buildingId,
                );
                this.emit("proceed");
              }
            },
          }),
        );
      }

      if (this.mode === "all") {
        //TODO:
      }
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

      if (this.mode === "upgrade") {
        this.append(
          new Button({
            type: ButtonType.Contained,
            title: "Upgrade",
            onClick: () => {
              if (this.actor.type === "unit") {
                //TODO: new UpgradeUnitModal(this.actor);
                this.emit("proceed");
              }
            },
          }),
        );
      }

      if (this.mode === "all") {
        const units = await UnitManager.loadAllUnits();
        if (
          units.find((u) =>
            this.actor.type === "unit" && u.canBeTrained &&
            u.prerequisiteUnitId === this.actor.unitId
          ) !== undefined
        ) {
          this.append(
            new Button({
              type: ButtonType.Contained,
              title: "Upgrade",
              onClick: () => {
                if (this.actor.type === "unit") {
                  //TODO: new UpgradeUnitModal(this.actor);
                  this.emit("proceed");
                }
              },
            }),
          );
        }

        this.append(
          new Button({
            type: ButtonType.Contained,
            title: "Move",
            onClick: () => {
              /*if (
                this.actor.type === "unit" &&
                GameController.selectedTileCoordinates
              ) {
                GameController.unitsToMove = [this.actor];
                World.showMovableArea(GameController.selectedTileCoordinates, [
                  this.actor,
                ]);
                this.emit("proceed");
              }*/
            },
          }),
          new Button({
            type: ButtonType.Contained,
            title: "Move & Attack",
            onClick: () => {
              /*if (
                this.actor.type === "unit" &&
                GameController.selectedTileCoordinates
              ) {
                GameController.unitsToMoveAndAttack = [this.actor];
                World.showAttackableArea(
                  GameController.selectedTileCoordinates,
                  [this.actor],
                );
                this.emit("proceed");
              }*/
            },
          }),
        );

        if (unit.attackRange > 0) {
          this.append(
            new Button({
              type: ButtonType.Contained,
              title: "Ranged Attack",
              onClick: () => {
                /*if (
                  this.actor.type === "unit" &&
                  GameController.selectedTileCoordinates
                ) {
                  GameController.unitsToRangedAttack = [this.actor];
                  World.showRangedAttackableArea(
                    GameController.selectedTileCoordinates,
                    [this.actor],
                  );
                  this.emit("proceed");
                }*/
              },
            }),
          );
        }
      }
    }
  }
}
