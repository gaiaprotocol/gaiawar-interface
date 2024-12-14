import { Store } from "@common-module/app";
import { Fullscreen, GameObject } from "@gaiaengine/2d";
import GameConfig from "./GameConfig.js";
import GameController from "./GameController.js";
import World from "./world/World.js";
import TileHoverOverlay from "./world/tile-overlays/TileHoverOverlay.js";
import TileSelectedOverlay from "./world/tile-overlays/TileSelectedOverlay.js";

class GaiaWarScreen extends Fullscreen {
  private store = new Store("gaia-war-screen");

  private isMouseDown = false;
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private lastX = 0;
  private lastY = 0;

  private dragThreshold = 5;

  constructor() {
    super(
      { backgroundColor: 0x121212 },
      World,
      new GameObject(0, 0, TileHoverOverlay, TileSelectedOverlay),
    );

    this.camera.setPosition(
      -(this.store.get<number>("worldX") ?? 0),
      -(this.store.get<number>("worldY") ?? 0),
    );
    this.camera.scale = this.store.get("worldZoom") ?? 0.5;

    this
      .onDom("mousedown", (event) => {
        event.preventDefault();

        this.isMouseDown = true;
        this.isDragging = false;
        this.dragStartX = event.clientX;
        this.dragStartY = event.clientY;
        this.lastX = event.clientX;
        this.lastY = event.clientY;
      })
      .onDom("mousemove", (event) => {
        const scale = this.camera.scale;
        const cameraX = this.camera.x;
        const cameraY = this.camera.y;

        const screenX = event.clientX;
        const screenY = event.clientY;

        if (this.isMouseDown) {
          const distanceMoved = Math.sqrt(
            (screenX - this.dragStartX) ** 2 + (screenY - this.dragStartY) ** 2,
          );
          if (!this.isDragging && distanceMoved > this.dragThreshold) {
            this.isDragging = true;
          }

          if (this.isDragging) {
            const worldX = -cameraX + ((screenX - this.lastX) / scale);
            const worldY = -cameraY + ((screenY - this.lastY) / scale);

            this.camera.setPosition(-worldX, -worldY);

            this.store.setPermanent("worldX", -this.camera.x);
            this.store.setPermanent("worldY", -this.camera.y);

            this.lastX = screenX;
            this.lastY = screenY;
          } else {
            const worldX = ((screenX - this.width / 2) / scale) +
              cameraX;
            const worldY = ((screenY - this.height / 2) / scale) +
              cameraY;

            const tileX = Math.round(worldX / GameConfig.tileSize);
            const tileY = Math.round(worldY / GameConfig.tileSize);

            TileHoverOverlay.setPosition(
              tileX * GameConfig.tileSize,
              tileY * GameConfig.tileSize,
            );
          }
        } else {
          const worldX = ((screenX - this.width / 2) / scale) + cameraX;
          const worldY = ((screenY - this.height / 2) / scale) + cameraY;

          const tileX = Math.round(worldX / GameConfig.tileSize);
          const tileY = Math.round(worldY / GameConfig.tileSize);

          TileHoverOverlay.setPosition(
            tileX * GameConfig.tileSize,
            tileY * GameConfig.tileSize,
          );
        }
      })
      .onDom("mouseup", () => {
        if (!this.isDragging) {
          const tileX = Math.round(
            TileHoverOverlay.x / GameConfig.tileSize,
          );
          const tileY = Math.round(
            TileHoverOverlay.y / GameConfig.tileSize,
          );
          GameController.selectTile(tileX, tileY);
        }

        this.isMouseDown = false;
        this.isDragging = false;
      })
      .onDom("wheel", (event) => {
        event.preventDefault();

        let worldZoom = this.camera.scale + event.deltaY / 1000;

        if (worldZoom < 0.2) worldZoom = 0.2;
        if (worldZoom > 10) worldZoom = 10;

        this.camera.scale = worldZoom;

        this.store.setPermanent("worldZoom", worldZoom);
      });
  }
}

export default new GaiaWarScreen();
