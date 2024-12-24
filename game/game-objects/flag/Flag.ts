import { GameObject, Sprite } from "@gaiaengine/2d";
import { PendingCommandType } from "../../data/pending-command/PendingCommand.js";
import TileFaction from "../../data/tile/TileFaction.js";

export default class Flag extends GameObject {
  constructor(faction: TileFaction, type: PendingCommandType) {
    super(0, 0);
    this.append(new Sprite(0, 0, `/assets/flags/flag-${faction}.png`)).setPivot(
      -19,
      64,
    );
    if (type === PendingCommandType.CONSTRUCT) {
      this.append(new Sprite(1, -25, "/assets/flags/icons/constructing.png"));
    } else if (type === PendingCommandType.TRAIN) {
      this.append(new Sprite(1, -25, "/assets/flags/icons/training.png"));
    }
  }
}
