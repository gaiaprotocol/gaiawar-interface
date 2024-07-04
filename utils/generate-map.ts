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
  FillTopLeft = "fill-top-left",
  FillTopRight = "fill-top-right",
  FillBottomLeft = "fill-bottom-left",
  FillBottomRight = "fill-bottom-right",
}

interface TilemapData {
  terreins: {
    [id: string]: {
      [direction: string]: { spritesheet: string; frame: string }[];
    };
  };
  terrainMap: { [cord: string]: string }; // { row, col } -> terrainId
  objects: {
    x: number;
    y: number;
    spritesheet: string;
    frame: string;
  }[];
}

const mapData = fs.readFileSync("./data/map-tiles.txt", "utf-8");

const tilemapData: TilemapData = {
  terreins: {},
  terrainMap: {},
  objects: [],
};

for (const [tileId, tileData] of Object.entries(tilesData)) {
  tilemapData.terreins[`terrein-${tileId}`] = {
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
    [TerrainDirection.FillTopLeft]: tileData.fillLeftTop.parts[0].frames.map((
      frame,
    ) => (keyToSpritesheet as any)[frame]),
    [TerrainDirection.FillTopRight]: tileData.fillRightTop.parts[0].frames.map(
      (
        frame,
      ) => (keyToSpritesheet as any)[frame],
    ),
    [TerrainDirection.FillBottomLeft]: tileData.fillLeftBottom.parts[0].frames
      .map((
        frame,
      ) => (keyToSpritesheet as any)[frame]),
    [TerrainDirection.FillBottomRight]: tileData.fillRightBottom.parts[0]
      .frames.map((
        frame,
      ) => (keyToSpritesheet as any)[frame]),
  };
}

for (let i = 0; i < mapData.length; i += 14) {
  const tileId = mapData[i];
  tilemapData
    .terrainMap[`${Math.floor(i / (100 * 14)) - 50},${i / 14 % 100 - 50}`] =
      `terrain-${tileId}`;
}

for (const mapObject of mapObjects as any) {
  const key = (objectsData as any)[mapObject.objectIndex][mapObject.state]
    .parts[0][mapObject.direction].frames[mapObject.kind];
  tilemapData.objects.push({
    x: mapObject.x,
    y: mapObject.y,
    ...(keyToSpritesheet as any)[key],
  });
}

fs.writeFileSync(
  "../public/assets/optimized-tiles/map.json",
  JSON.stringify(tilemapData, null, 2),
);
