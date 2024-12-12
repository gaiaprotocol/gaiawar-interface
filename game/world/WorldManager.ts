import { BodyNode, Store } from "@common-module/app";
import { Fullscreen } from "@gaiaengine/2d";
import World from "./World.js";

class WorldManager {
  private store = new Store("world-manager");

  private dragging = false;
  private dragX = 0;
  private dragY = 0;

  private screen!: Fullscreen;
  private world!: World;

  public init() {
    this.screen = new Fullscreen(
      { backgroundColor: 0x121212 },
      this.world = new World(),
    ).appendTo(BodyNode);

    this.screen.camera.setPosition(
      -(this.store.get<number>("worldX") ?? 0),
      -(this.store.get<number>("worldY") ?? 0),
    );
    this.screen.camera.scale = this.store.get("worldZoom") ?? 1;

    this.screen
      .onDom("mousedown", (event) => {
        event.preventDefault();

        this.dragging = true;
        this.dragX = event.clientX;
        this.dragY = event.clientY;
      })
      .onDom("mousemove", (event) => {
        if (this.dragging) {
          const worldX = -this.screen.camera.x +
            ((event.clientX - this.dragX) / this.screen.camera.scale);
          const worldY = -this.screen.camera.y +
            ((event.clientY - this.dragY) / this.screen.camera.scale);

          this.screen.camera.setPosition(-worldX, -worldY);

          this.dragX = event.clientX;
          this.dragY = event.clientY;

          this.store.setPermanent("worldX", worldX);
          this.store.setPermanent("worldY", worldY);
        }
      })
      .onDom("mouseup", () => this.dragging = false)
      .onDom("wheel", (event) => {
        event.preventDefault();

        let worldZoom = this.screen.camera.scale + event.deltaY / 1000;

        if (worldZoom < 0.2) worldZoom = 0.2;
        if (worldZoom > 10) worldZoom = 10;

        this.screen.camera.scale = worldZoom;

        this.store.setPermanent("worldZoom", worldZoom);
      });
  }
}

export default new WorldManager();
