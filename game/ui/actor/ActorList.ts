import { DomNode } from "@common-module/app";
import Actor from "./Actor.js";
import ActorMode from "./ActorMode.js";

export default class ActorList extends DomNode {
  constructor(mode: ActorMode, actors: Actor[]) {
    super(".actor-list");
  }
}
