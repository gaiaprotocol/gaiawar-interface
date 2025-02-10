import { el } from "@common-module/app";
import {
  Button,
  ButtonType,
  QuantityInputDialog,
  StructuredModal,
} from "@common-module/app-components";
import { Coordinates } from "@gaiaengine/2d";
import { CloseIcon } from "@gaiaprotocol/svg-icons";
import UpgradeUnitCommandExecutor from "../../command-executors/UpgradeUnitCommandExecutor.js";
import { UnitQuantity } from "../../data/tile/TileData.js";
import UnitManager from "../../data/unit/UnitManager.js";
import UserMaterialList from "../material/UserMaterialList.js";
import TrainingUnitList from "./TrainingUnitList.js";

export default class UpgradeUnitModal extends StructuredModal {
  private unitList: TrainingUnitList;

  constructor(coordinates: Coordinates, private previousUnit: UnitQuantity) {
    super(".upgrade-unit-modal");

    this.appendToHeader(
      el("h2", "Upgrade Your Unit"),
      new Button({
        type: ButtonType.Icon,
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
        const max = previousUnit.quantity;

        new QuantityInputDialog({
          title: "Upgrade Unit",
          message: "Enter the quantity of units you want to upgrade.",
          min: 1,
          value: max,
          max,
          onConfirm: (quantity) => {
            UpgradeUnitCommandExecutor.execute(coordinates, {
              unitId,
              quantity,
            });
          },
        });

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
