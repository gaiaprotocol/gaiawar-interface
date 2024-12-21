import { StructuredModal } from "@common-module/app-components";
import Actor from "./Actor.js";
import ActorList from "./ActorList.js";

export default class UpgradeActorInTileModal extends StructuredModal {
  private actorList: ActorList;

  constructor(actors: Actor[]) {
    super(".upgrade-actor-in-tile-modal");
  }
}
