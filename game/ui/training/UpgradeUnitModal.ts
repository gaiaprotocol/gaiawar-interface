import { el } from "@common-module/app";
import {
  Button,
  ButtonType,
  StructuredModal,
} from "@common-module/app-components";
import { CloseIcon } from "@gaiaprotocol/svg-icons";
import { UnitQuantity } from "../../data/TileData.js";
import UnitManager from "../../data/unit/UnitManager.js";
import UserMaterialList from "../material/UserMaterialList.js";
import TrainingUnitList from "./TrainingUnitList.js";

export default class UpgradeUnitModal extends StructuredModal {
  private unitList: TrainingUnitList;

  constructor(private previousUnit: UnitQuantity) {
    super(".upgrade-unit-modal");

    this.appendToHeader(
      el("h2", "Upgrade Your Unit"),
      new Button({
        type: ButtonType.Circle,
        icon: new CloseIcon(),
        onClick: () => this.remove(),
      }),
    );
    this.appendToMain(
      el("p", "Select a unit to upgrade."),
      this.unitList = new TrainingUnitList(),
    );
    this.appendToFooter(new UserMaterialList());

    this.unitList.on(
      "unitSelected",
      (unitId) => {
        //TODO:
        //GameController.upgradeUnit(unitId);
        this.remove();
      },
    );

    this.loadBuildings();
  }

  private async loadBuildings() {
    const units = await UnitManager.loadAllUnits();
    this.unitList.setUnits(
      units.filter((u) =>
        u.canBeTrained && u.prerequisiteUnitId === this.previousUnit.unitId
      ),
    );
  }
}
