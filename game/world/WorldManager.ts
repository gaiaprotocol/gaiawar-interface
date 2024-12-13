import { BodyNode, Store } from "@common-module/app";
import { Fullscreen, Sprite } from "@gaiaengine/2d";
import GameConfig from "../GameConfig.js";
import World from "./World.js";

class WorldManager {
  private store = new Store("world-manager");

  private dragging = false;
  private dragX = 0;
  private dragY = 0;

  private screen!: Fullscreen;
  private world = new World();
  private tileHoverOverlay = new Sprite(
    -999999,
    -999999,
    "/assets/tile/hover.png",
  );

  public init() {
    this.screen = new Fullscreen(
      { backgroundColor: 0x121212 },
      this.world,
      this.tileHoverOverlay,
    ).appendTo(BodyNode);

    this.screen.camera.setPosition(
      -(this.store.get<number>("worldX") ?? 0),
      -(this.store.get<number>("worldY") ?? 0),
    );
    this.screen.camera.scale = this.store.get("worldZoom") ?? 0.5;

    this.screen
      .onDom("mousedown", (event) => {
        event.preventDefault();

        this.dragging = true;
        this.dragX = event.clientX;
        this.dragY = event.clientY;
      })
      .onDom("mousemove", (event) => {
        const scale = this.screen.camera.scale;
        const cameraX = this.screen.camera.x;
        const cameraY = this.screen.camera.y;

        const screenX = event.clientX;
        const screenY = event.clientY;

        if (this.dragging) {
          const worldX = -cameraX + ((screenX - this.dragX) / scale);
          const worldY = -cameraY + ((screenY - this.dragY) / scale);

          this.screen.camera.setPosition(-worldX, -worldY);

          this.dragX = screenX;
          this.dragY = screenY;

          this.store.setPermanent("worldX", worldX);
          this.store.setPermanent("worldY", worldY);
        } else {
          const worldX = ((screenX - this.screen.width / 2) / scale) + cameraX;
          const worldY = ((screenY - this.screen.height / 2) / scale) + cameraY;

          const tileX = Math.round(worldX / GameConfig.tileSize);
          const tileY = Math.round(worldY / GameConfig.tileSize);

          this.tileHoverOverlay.setPosition(
            tileX * GameConfig.tileSize,
            tileY * GameConfig.tileSize,
          );
        }
      })
      .onDom("mouseup", () => {
        this.dragging = false;

        //TODO:
      })
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
