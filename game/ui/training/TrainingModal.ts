import { el } from "@common-module/app";
import {
  Button,
  ButtonType,
  QuantityInputDialog,
  StructuredModal,
} from "@common-module/app-components";
import { Coordinates } from "@gaiaengine/2d";
import { CloseIcon } from "@gaiaprotocol/svg-icons";
import TrainingCommandExecutor from "../../command-executors/TrainingCommandExecutor.js";
import GaiaWarConfig from "../../config/GaiaWarConfig.js";
import TileManager from "../../data/tile/TileManager.js";
import UnitManager from "../../data/unit/UnitManager.js";
import UserMaterialList from "../material/UserMaterialList.js";
import TrainingUnitList from "./TrainingUnitList.js";

export default class TrainingModal extends StructuredModal {
  private unitList: TrainingUnitList;

  constructor(private coordinates: Coordinates, private buildingId: number) {
    super(".training-modal");

    this.appendToHeader(
      el("h2", "Train Units"),
      new Button({
        type: ButtonType.Icon,
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
        const tileData = TileManager.getCurrentTileData(
          coordinates.x,
          coordinates.y,
        );

        const totalUnits = tileData
          ? tileData.units.reduce(
            (total, u) => total + u.quantity,
            0,
          )
          : 0;

        const max = GaiaWarConfig.maxUnitsPerTile - totalUnits;

        new QuantityInputDialog({
          title: "Train Units",
          message: "Enter the quantity of units you want to train.",
          min: 1,
          value: max,
          max,
          onConfirm: (quantity) => {
            TrainingCommandExecutor.execute(this.coordinates, {
              unitId,
              quantity,
            });
          },
        });

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
