import { BodyNode } from "@common-module/app";
import { Fullscreen } from "@gaiaengine/2d";
import World from "./World.js";

class WorldManager {
  private screen: Fullscreen | undefined;
  private world: World | undefined;

  public createWorld() {
    this.screen = new Fullscreen(
      this.world = new World(),
    ).appendTo(BodyNode);

    this.screen.camera.scale = 0.5;
  }
}

export default new WorldManager();
