import { DomNode } from "@common-module/app";
import Actor from "./Actor.js";
import ActorMode from "./ActorMode.js";

export default class ActorListItem extends DomNode {
  constructor(mode: ActorMode, actor: Actor) {
    super(".actor-list-item");
  }
}
