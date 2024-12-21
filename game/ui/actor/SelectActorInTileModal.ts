import { StructuredModal } from "@common-module/app-components";
import ActorList from "./ActorList.js";
import Actor from "./Actor.js";

export default class SelectActorInTileModal extends StructuredModal {
  private actorList: ActorList;

  constructor(actors: Actor[]) {
    super(".select-actor-in-tile-modal");
  }
}
