import { DomNode } from "@common-module/app";
import Actor from "./Actor.js";
import ActorListItem from "./ActorListItem.js";
import ActorMode from "./ActorMode.js";

export default class ActorList extends DomNode<HTMLDivElement, {
  proceed: () => void;
}> {
  constructor(private mode: ActorMode, actors?: Actor[]) {
    super(".actor-list");
    if (actors) this.setActors(actors);
  }

  public setActors(actors: Actor[]) {
    this.clear();
    for (const actor of actors) {
      this.addActor(actor);
    }
  }

  public addActor(actor: Actor) {
    const item = new ActorListItem(this.mode, actor).appendTo(this);
    item.on("proceed", () => this.emit("proceed"));
  }
}
