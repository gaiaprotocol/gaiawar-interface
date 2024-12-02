import { BodyNode } from "@common-module/app";
import { Fullscreen } from "@gaiaengine/2d";

class WorldManager {
  private screen: Fullscreen | undefined;

  public createWorld() {
    this.screen = new Fullscreen({
      backgroundColor: 0x121212,
    }).appendTo(BodyNode);

    this.screen.camera.scale = 0.5;
  }
}

export default new WorldManager();
