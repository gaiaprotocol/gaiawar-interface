import fs from "fs";
import keyToSpritesheet from "../public/assets/optimized-tiles/key-to-spritesheet.json" assert {
  type: "json",
};
import mapObjects from "./data/map-objects.json" assert { type: "json" };
import objectsData from "./data/objects.json" assert { type: "json" };
import tilesData from "./data/tiles.json" assert { type: "json" };

enum TerrainDirection {
  TopLeft = "top-left",
  Top = "top",
  TopRight = "top-right",
  Left = "left",
  Center = "center",
  Right = "right",
  BottomLeft = "bottom-left",
  Bottom = "bottom",
  BottomRight = "bottom-right",

  FillFull = "fill-full",
  FillTopLeftRight = "fill-top-left-right",
  FillTopLeftBottom = "fill-top-left-bottom",
  FillTopLeft = "fill-top-left",
  FillTopRightBottom = "fill-top-right-bottom",
  FillTopRight = "fill-top-right",
  FillTopBottom = "fill-top-bottom",
  FillLeftRight = "fill-left-right",
  FillBottomLeft = "fill-bottom-left",
  FillBottomRight = "fill-bottom-right",
}

interface MapData {
  terrains: {
    [id: string]: {
      [direction: string]: {
        spritesheet: string;
        frame: string;
        zIndex: number;
      }[];
    };
  };
  objects: {
    [id: string]: {
      spritesheet: string;
      frame: string;
      zIndex: number;
    };
  };
  terrainMap: { [cord: string]: string }; // { row, col } -> terrainId
  mapObjects: { x: number; y: number; object: string }[];
}

const mapTiles = fs.readFileSync("./data/map-tiles.txt", "utf-8");

const mapData: MapData = {
  terrains: {},
  objects: {},
  terrainMap: {},
  mapObjects: [],
};

for (const [tileId, tileData] of Object.entries(tilesData)) {
  mapData.terrains[`terrain-${tileId}`] = {
    [TerrainDirection.TopLeft]: tileData.leftTop.parts[0].frames.map((frame) =>
      (keyToSpritesheet as any)[frame]
    ),
    [TerrainDirection.Top]: tileData.top.parts[0].frames.map((frame) =>
      (keyToSpritesheet as any)[frame]
    ),
    [TerrainDirection.TopRight]: tileData.rightTop.parts[0].frames.map((
      frame,
    ) => (keyToSpritesheet as any)[frame]),
    [TerrainDirection.Left]: tileData.left.parts[0].frames.map((frame) =>
      (keyToSpritesheet as any)[frame]
    ),
    [TerrainDirection.Center]: tileData.center.parts[0].frames.map((frame) =>
      (keyToSpritesheet as any)[frame]
    ),
    [TerrainDirection.Right]: tileData.right.parts[0].frames.map((frame) =>
      (keyToSpritesheet as any)[frame]
    ),
    [TerrainDirection.BottomLeft]: tileData.leftBottom.parts[0].frames.map((
      frame,
    ) => (keyToSpritesheet as any)[frame]),
    [TerrainDirection.Bottom]: tileData.bottom.parts[0].frames.map((frame) =>
      (keyToSpritesheet as any)[frame]
    ),
    [TerrainDirection.BottomRight]: tileData.rightBottom.parts[0].frames.map((
      frame,
    ) => (keyToSpritesheet as any)[frame]),
    [TerrainDirection.FillFull]: tileData.center.parts[0].frames.map((
      frame,
    ) => (keyToSpritesheet as any)[frame]),
    [TerrainDirection.FillTopLeftRight]: tileData.center.parts[0]
      .frames.map(
        (frame) => (keyToSpritesheet as any)[frame],
      ),
    [TerrainDirection.FillTopLeftBottom]: tileData.center.parts[0]
      .frames.map(
        (frame) => (keyToSpritesheet as any)[frame],
      ),
    [TerrainDirection.FillTopLeft]: tileData.fillLeftTop.parts[0].frames.map(
      (frame) => (keyToSpritesheet as any)[frame],
    ),
    [TerrainDirection.FillTopRightBottom]: tileData.center.parts[0]
      .frames.map(
        (frame) => (keyToSpritesheet as any)[frame],
      ),
    [TerrainDirection.FillTopRight]: tileData.fillRightTop.parts[0].frames.map(
      (frame) => (keyToSpritesheet as any)[frame],
    ),
    [TerrainDirection.FillTopBottom]: tileData.center.parts[0].frames
      .map(
        (frame) => (keyToSpritesheet as any)[frame],
      ),
    [TerrainDirection.FillLeftRight]: tileData.center.parts[0].frames
      .map(
        (frame) => (keyToSpritesheet as any)[frame],
      ),
    [TerrainDirection.FillBottomLeft]: tileData.fillLeftBottom.parts[0].frames
      .map(
        (frame) => (keyToSpritesheet as any)[frame],
      ),
    [TerrainDirection.FillBottomRight]: tileData.fillRightBottom.parts[0].frames
      .map(
        (frame) => (keyToSpritesheet as any)[frame],
      ),
  };
}

for (let i = 0; i < mapTiles.length; i += 14) {
  const tileId = mapTiles[i];
  mapData
    .terrainMap[`${Math.floor(i / (100 * 14)) - 50},${i / 14 % 100 - 50}`] =
      `terrain-${tileId}`;
}

for (const mapObject of mapObjects as any) {
  const key = (objectsData as any)[mapObject.objectIndex][mapObject.state]
    .parts[0][mapObject.direction].frames[mapObject.kind];
  const spritesheet = (keyToSpritesheet as any)[key];

  mapData.objects[spritesheet.frame] = {
    spritesheet: spritesheet.spritesheet,
    frame: spritesheet.frame,
    zIndex: 5,
  };

  mapData.mapObjects.push({
    object: spritesheet.frame,
    x: mapObject.x,
    y: mapObject.y,
  });
}

fs.writeFileSync(
  "../public/assets/optimized-tiles/map.json",
  JSON.stringify(mapData, null, 2),
);