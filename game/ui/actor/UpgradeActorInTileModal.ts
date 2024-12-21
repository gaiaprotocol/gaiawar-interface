import { el } from "@common-module/app";
import {
  Button,
  ButtonType,
  StructuredModal,
} from "@common-module/app-components";
import { CloseIcon } from "@gaiaprotocol/svg-icons";
import UserMaterialList from "../material/UserMaterialList.js";
import Actor from "./Actor.js";
import ActorList from "./ActorList.js";

export default class UpgradeActorInTileModal extends StructuredModal {
  private actorList: ActorList;

  constructor(actors: Actor[]) {
    super(".upgrade-actor-in-tile-modal");

    this.appendToHeader(
      el("h2", "Upgrade Building or Unit"),
      new Button({
        type: ButtonType.Circle,
        icon: new CloseIcon(),
        onClick: () => this.remove(),
      }),
    );
    this.appendToMain(
      el("p", "Select a building or unit to upgrade."),
      this.actorList = new ActorList("upgrade", actors),
    );
    this.appendToFooter(new UserMaterialList());
  }
}
