import { Store } from "@common-module/app";
import { Fullscreen, GameObject } from "@gaiaengine/2d";
import GameConfig from "./GameConfig.js";
import GameController from "./GameController.js";
import World from "./world/World.js";
import TileHoverOverlay from "./world/tile-overlays/TileHoverOverlay.js";
import TileSelectedOverlay from "./world/tile-overlays/TileSelectedOverlay.js";

class GameScreen extends Fullscreen {
  private store = new Store("game-screen");

  private isMousePressed = false;
  private isDraggingView = false;
  private initialDragX = 0;
  private initialDragY = 0;
  private previousMouseX = 0;
  private previousMouseY = 0;

  private dragActivationThreshold = 5;

  constructor() {
    super(
      { backgroundColor: 0x121212 },
      World,
      new GameObject(0, 0, TileHoverOverlay, TileSelectedOverlay),
    );

    this.initializeCamera();
    this.attachEventListeners();
  }

  private initializeCamera(): void {
    this.camera.setPosition(
      -(this.store.get<number>("cameraX") ?? 0),
      -(this.store.get<number>("cameraY") ?? 0),
    );
    this.camera.scale = this.store.get<number>("cameraZoom") ?? 0.5;
  }

  private attachEventListeners(): void {
    this
      .onDom("mousedown", this.handleMouseDown.bind(this))
      .onDom("mousemove", this.handleMouseMove.bind(this))
      .onDom("mouseup", this.handleMouseUp.bind(this))
      .onDom("wheel", this.handleMouseWheel.bind(this));
  }

  private handleMouseDown(event: MouseEvent): void {
    event.preventDefault();

    this.isMousePressed = true;
    this.isDraggingView = false;
    this.initialDragX = event.clientX;
    this.initialDragY = event.clientY;
    this.previousMouseX = event.clientX;
    this.previousMouseY = event.clientY;
  }

  private handleMouseMove(event: MouseEvent): void {
    const { clientX: mouseX, clientY: mouseY } = event;
    const { scale, x: cameraX, y: cameraY } = this.camera;

    if (this.isMousePressed) {
      const distanceMoved = Math.sqrt(
        (mouseX - this.initialDragX) ** 2 + (mouseY - this.initialDragY) ** 2,
      );

      if (
        !this.isDraggingView && distanceMoved > this.dragActivationThreshold
      ) {
        this.isDraggingView = true;
      }

      if (this.isDraggingView) {
        const deltaX = (mouseX - this.previousMouseX) / scale;
        const deltaY = (mouseY - this.previousMouseY) / scale;

        this.camera.setPosition(cameraX - deltaX, cameraY - deltaY);

        this.store.setPermanent("cameraX", -this.camera.x);
        this.store.setPermanent("cameraY", -this.camera.y);

        this.previousMouseX = mouseX;
        this.previousMouseY = mouseY;
      } else {
        this.updateHoverOverlay(mouseX, mouseY);
      }
    } else {
      this.updateHoverOverlay(mouseX, mouseY);
    }
  }

  private handleMouseUp(): void {
    if (!this.isDraggingView) {
      const tileX = Math.round(TileHoverOverlay.x / GameConfig.tileSize);
      const tileY = Math.round(TileHoverOverlay.y / GameConfig.tileSize);

      GameController.selectTile(tileX, tileY);
    }

    this.isMousePressed = false;
    this.isDraggingView = false;
  }

  private handleMouseWheel(event: WheelEvent): void {
    event.preventDefault();

    let updatedZoom = this.camera.scale + event.deltaY / 1000;
    updatedZoom = Math.max(0.2, Math.min(updatedZoom, 10));

    this.camera.scale = updatedZoom;
    this.store.setPermanent("cameraZoom", updatedZoom);
  }

  private updateHoverOverlay(mouseX: number, mouseY: number): void {
    const { scale, x: cameraX, y: cameraY } = this.camera;

    const worldX = ((mouseX - this.width / 2) / scale) + cameraX;
    const worldY = ((mouseY - this.height / 2) / scale) + cameraY;

    const tileX = Math.round(worldX / GameConfig.tileSize);
    const tileY = Math.round(worldY / GameConfig.tileSize);

    TileHoverOverlay.setPosition(
      tileX * GameConfig.tileSize,
      tileY * GameConfig.tileSize,
    );
  }
}

export default new GameScreen();
