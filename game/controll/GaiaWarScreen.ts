import { Store } from "@common-module/app";
import { Coordinates, Fullscreen } from "@gaiaengine/2d";
import GaiaWarConfig from "../config/GaiaWarConfig.js";

interface GaiaWarScreenOptions {
  onTileSelected: (coordinates: Coordinates) => void;
  onTileHover: (coordinates: Coordinates) => void;
}

export default class GaiaWarScreen extends Fullscreen {
  private static readonly MIN_ZOOM = 0.2;
  private static readonly MAX_ZOOM = 5;
  private static readonly DRAG_THRESHOLD = 5;
  private static readonly ZOOM_SENSITIVITY = 1000;

  private store = new Store("gaiawar-screen");

  private isMousePressed = false;
  private isDraggingView = false;
  private initialDragX = 0;
  private initialDragY = 0;
  private previousMouseX = 0;
  private previousMouseY = 0;

  constructor(private options: GaiaWarScreenOptions) {
    super({ backgroundColor: 0x121212 });

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
    if (this.isMousePressed) {
      this.handleDragMove(mouseX, mouseY);
    } else {
      this.updateHoverOverlay(mouseX, mouseY);
    }
  }

  private handleDragMove(mouseX: number, mouseY: number): void {
    const cameraX = this.camera.getX();
    const cameraY = this.camera.getY();
    const scale = this.camera.scale;

    const distanceMoved = Math.sqrt(
      (mouseX - this.initialDragX) ** 2 + (mouseY - this.initialDragY) ** 2,
    );

    if (!this.isDraggingView && distanceMoved > GaiaWarScreen.DRAG_THRESHOLD) {
      this.isDraggingView = true;
    }

    if (this.isDraggingView) {
      const deltaX = (mouseX - this.previousMouseX) / scale;
      const deltaY = (mouseY - this.previousMouseY) / scale;

      this.camera.setPosition(cameraX - deltaX, cameraY - deltaY);

      this.store.setPermanent("cameraX", -this.camera.getX());
      this.store.setPermanent("cameraY", -this.camera.getY());

      this.previousMouseX = mouseX;
      this.previousMouseY = mouseY;
    } else {
      this.updateHoverOverlay(mouseX, mouseY);
    }
  }

  private mousePositionToTileCoordinates(
    mouseX: number,
    mouseY: number,
  ): Coordinates {
    const cameraX = this.camera.getX();
    const cameraY = this.camera.getY();
    const scale = this.camera.scale;

    const worldX = ((mouseX - this.width / 2) / scale) + cameraX;
    const worldY = ((mouseY - this.height / 2) / scale) + cameraY;

    const tileX = Math.round(worldX / GaiaWarConfig.tileSize);
    const tileY = Math.round(worldY / GaiaWarConfig.tileSize);

    return { x: tileX, y: tileY };
  }

  private handleMouseUp(event: MouseEvent): void {
    if (!this.isDraggingView) {
      this.options.onTileSelected(
        this.mousePositionToTileCoordinates(event.clientX, event.clientY),
      );
    }

    this.isMousePressed = false;
    this.isDraggingView = false;
  }

  private handleMouseWheel(event: WheelEvent): void {
    event.preventDefault();

    let updatedZoom = this.camera.scale +
      event.deltaY / GaiaWarScreen.ZOOM_SENSITIVITY;

    updatedZoom = Math.max(
      GaiaWarScreen.MIN_ZOOM,
      Math.min(updatedZoom, GaiaWarScreen.MAX_ZOOM),
    );

    this.camera.scale = updatedZoom;
    this.store.setPermanent("cameraZoom", updatedZoom);
  }

  private updateHoverOverlay(mouseX: number, mouseY: number): void {
    this.options.onTileHover(
      this.mousePositionToTileCoordinates(mouseX, mouseY),
    );
  }
}
