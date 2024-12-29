import { el } from "@common-module/app";
import {
  AppCompConfig,
  Button,
  ButtonType,
  StructuredModal,
} from "@common-module/app-components";
import { Coordinates } from "@gaiaengine/2d";
import BattlegroundContract from "../../contracts/core/BattlegroundContract.js";
import GaiaWarController from "../../controll/GaiaWarController.js";
import WorldMap from "./WorldMap.js";

export default class WorldMapModal extends StructuredModal {
  private worldMap: WorldMap;
  private goButton: Button;
  private selectedTilePosition: Coordinates | undefined;

  private isDragging: boolean = false;
  private lastMousePosition: { x: number; y: number } | undefined;

  constructor() {
    super(".world-map-modal");
    this.appendToHeader(el("h1", "World Map"));
    this.appendToMain(this.worldMap = new WorldMap());
    this.appendToFooter(
      new Button(".cancel", {
        title: "Cancel",
        onClick: () => this.remove(),
      }),
      this.goButton = new Button(".go", {
        type: ButtonType.Contained,
        title: "Go to Selected Tile",
        disabled: true,
        onClick: () => {
          if (this.selectedTilePosition) {
            GaiaWarController.setCenter(this.selectedTilePosition);
            this.remove();
          }
        },
      }),
    );
    this.loadMap();

    this.initDragToScroll();

    this.worldMap.on("tileSelected", (coordinates) => {
      this.selectedTilePosition = coordinates;
      this.goButton.enable();
    });
  }

  private initDragToScroll() {
    const mainElement = this.main.htmlElement;

    mainElement.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.lastMousePosition = {
        x: e.clientX,
        y: e.clientY,
      };
      mainElement.style.userSelect = "none";
    });

    mainElement.addEventListener("mousemove", (e) => {
      if (!this.isDragging || !this.lastMousePosition) return;

      const dx = e.clientX - this.lastMousePosition.x;
      const dy = e.clientY - this.lastMousePosition.y;

      mainElement.scrollLeft -= dx;
      mainElement.scrollTop -= dy;

      this.lastMousePosition = {
        x: e.clientX,
        y: e.clientY,
      };
    });

    document.addEventListener("mouseup", () => {
      this.isDragging = false;
      this.lastMousePosition = undefined;
      mainElement.style.userSelect = "";
    });

    mainElement.addEventListener("mouseleave", () => {
      this.isDragging = false;
      this.lastMousePosition = undefined;
      mainElement.style.userSelect = "";
    });
  }

  private async loadMap() {
    const loadingSpinner = new AppCompConfig.LoadingSpinner().appendTo(
      this.main,
    );
    const tiles = await BattlegroundContract.getTiles(
      { x: -50, y: -50 },
      { x: 49, y: 49 },
    );
    loadingSpinner.remove();

    this.worldMap.setTiles(tiles);

    const center = GaiaWarController.getCenter();
    const mainRect = this.main.calculateRect();

    this.main.htmlElement.scrollTo(
      center.x * WorldMap.TILE_SIZE + WorldMap.WORLDMAP_SIZE / 2 -
        mainRect.width / 2,
      center.y * WorldMap.TILE_SIZE + WorldMap.WORLDMAP_SIZE / 2 -
        mainRect.height / 2,
    );
  }
}
