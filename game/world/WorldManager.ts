import { BodyNode, Store } from "@common-module/app";
import { Fullscreen, GameObject, Sprite } from "@gaiaengine/2d";
import BuildingManager from "../building/BuildingManager.js";
import ConstructionContract from "../contracts/actions/ConstructionContract.js";
import GameConfig from "../GameConfig.js";
import TileHoverOverlay from "./TileHoverOverlay.js";
import TileSelectedOverlay from "./TileSelectedOverlay.js";
import World from "./World.js";

class WorldManager {
  private store = new Store("world-manager");

  private isMouseDown = false;
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private lastX = 0;
  private lastY = 0;

  private dragThreshold = 5;

  private screen!: Fullscreen;
  private world = new World({
    onTileRangeChanged: (range) => {
      console.log(range);
    },
  });

  private tileHoverOverlay = new TileHoverOverlay();
  private tileSelectedOverlay = new TileSelectedOverlay();

  private buildingToBuild: number | undefined;

  public init() {
    this.screen = new Fullscreen(
      { backgroundColor: 0x121212 },
      this.world,
      new GameObject(0, 0, this.tileHoverOverlay, this.tileSelectedOverlay),
    ).appendTo(BodyNode);

    this.screen.camera.setPosition(
      -(this.store.get<number>("worldX") ?? 0),
      -(this.store.get<number>("worldY") ?? 0),
    );
    this.screen.camera.scale = this.store.get("worldZoom") ?? 0.5;

    this.screen
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
        const scale = this.screen.camera.scale;
        const cameraX = this.screen.camera.x;
        const cameraY = this.screen.camera.y;

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

            this.screen.camera.setPosition(-worldX, -worldY);

            this.store.setPermanent("worldX", -this.screen.camera.x);
            this.store.setPermanent("worldY", -this.screen.camera.y);

            this.lastX = screenX;
            this.lastY = screenY;
          } else {
            const worldX = ((screenX - this.screen.width / 2) / scale) +
              cameraX;
            const worldY = ((screenY - this.screen.height / 2) / scale) +
              cameraY;

            const tileX = Math.round(worldX / GameConfig.tileSize);
            const tileY = Math.round(worldY / GameConfig.tileSize);

            this.tileHoverOverlay.setPosition(
              tileX * GameConfig.tileSize,
              tileY * GameConfig.tileSize,
            );
          }
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
        if (!this.isDragging) {
          this.tileSelectedOverlay.setPosition(
            this.tileHoverOverlay.x,
            this.tileHoverOverlay.y,
          );

          const tileX = Math.round(
            this.tileHoverOverlay.x / GameConfig.tileSize,
          );
          const tileY = Math.round(
            this.tileHoverOverlay.y / GameConfig.tileSize,
          );

          this.build(tileX, tileY);
        }

        this.isMouseDown = false;
        this.isDragging = false;
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

  public async setBuildingToBuild(buildingId: number) {
    this.buildingToBuild = buildingId;

    const building = await BuildingManager.getBuilding(buildingId);
    this.tileHoverOverlay.setBuildingPreview(
      new Sprite(0, 0, `/assets/${building.sprites.base}`),
    );
  }

  private async build(tileX: number, tileY: number) {
    if (this.buildingToBuild) {
      await ConstructionContract.constructBuilding(
        tileX,
        tileY,
        this.buildingToBuild,
      );
    }
  }
}

export default new WorldManager();
