import { el } from "@common-module/app";
import {
  Button,
  ButtonType,
  StructuredModal,
} from "@common-module/app-components";
import { CloseIcon } from "@gaiaprotocol/svg-icons";
import GameController from "../../core/GameController.js";
import UnitManager from "../../data/unit/UnitManager.js";
import UserMaterialList from "../material/UserMaterialList.js";
import TrainingUnitList from "./TrainingUnitList.js";

export default class TrainingModal extends StructuredModal {
  private unitList: TrainingUnitList;

  constructor(private buildingId: number) {
    super(".training-modal");

    this.appendToHeader(
      el("h2", "Train Units"),
      new Button({
        type: ButtonType.Circle,
        icon: new CloseIcon(),
        onClick: () => this.remove(),
      }),
    );
    this.appendToMain(
      el("p", "Select a unit to train."),
      this.unitList = new TrainingUnitList(),
    );
    this.appendToFooter(new UserMaterialList());

    this.unitList.on(
      "unitSelected",
      (unitId) => {
        //TEST
        GameController.trainUnits({ unitId, quantity: 1 });
        this.remove();
      },
    );

    this.loadUnits();
  }

  private async loadUnits() {
    const units = await UnitManager.loadAllUnits();
    this.unitList.setUnits(
      units.filter((u) =>
        u.canBeTrained && u.trainingBuildingIds.includes(this.buildingId)
      ),
    );
  }
}
