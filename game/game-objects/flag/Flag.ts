import { Fadeable, Sprite } from "@gaiaengine/2d";
import { PendingCommandType } from "../../data/pending-command/PendingCommand.js";
import TileFaction from "../../data/tile/TileFaction.js";

export default class Flag extends Fadeable {
  constructor(faction: TileFaction, public type: PendingCommandType) {
    super(0, 0);
    this.append(new Sprite(0, 0, `/assets/flags/flag-${faction}.png`)).setPivot(
      -19,
      64,
    );

    if (
      type === PendingCommandType.CONSTRUCT ||
      type === PendingCommandType.UPGRADE_BUILDING
    ) {
      this.append(new Sprite(1, -25, "/assets/flags/icons/construct.png"));
    } else if (
      type === PendingCommandType.TRAIN ||
      type === PendingCommandType.UPGRADE_UNIT
    ) {
      this.append(new Sprite(1, -25, "/assets/flags/icons/train.png"));
    } else if (type === PendingCommandType.MOVE) {
      this.append(new Sprite(1, -25, "/assets/flags/icons/move.png"));
    } else if (type === PendingCommandType.MOVE_AND_ATTACK) {
      this.append(new Sprite(1, -25, "/assets/flags/icons/attack.png"));
    } else if (type === PendingCommandType.RANGED_ATTACK) {
      this.append(new Sprite(1, -25, "/assets/flags/icons/ranged-attack.png"));
    } else if (type === PendingCommandType.COLLECT_LOOT) {
      this.append(new Sprite(1, -25, "/assets/flags/icons/collect.png"));
    }

    this.fadeIn(0.2);
  }
}
