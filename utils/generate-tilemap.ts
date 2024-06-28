import fs from "fs";
import keyToTile from "../public/assets/optimized-tiles/key-to-tile.json" assert {
  type: "json",
};
import mapObjects from "./data/map-objects.json" assert { type: "json" };
import objectsData from "./data/objects.json" assert { type: "json" };
import tilesData from "./data/tiles.json" assert { type: "json" };

enum AutotileDirection {
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

interface TilesetTile {
  tilesetId: string;
  row: number;
  col: number;
}

interface AutotileTile {
  autotileId: string;
}

type TileData = TilesetTile | AutotileTile;

interface TilemapData {
  tileSize: number;
  autotiles: { [id: string]: { [direction: string]: TilesetTile[] } };
  tiles: { [position: string]: TileData };
}

const mapData = fs.readFileSync("./data/map-tiles.txt", "utf-8");

const tilemapData: TilemapData = {
  tileSize: 256,
  autotiles: {},
  tiles: {},
};

for (const [tileId, tileData] of Object.entries(tilesData)) {
  tilemapData.autotiles[`autotile-${tileId}`] = {
    [AutotileDirection.TopLeft]: tileData.leftTop.parts[0].frames.map((frame) =>
      (keyToTile as any)[frame]
    ),
    [AutotileDirection.Top]: tileData.top.parts[0].frames.map((frame) =>
      (keyToTile as any)[frame]
    ),
    [AutotileDirection.TopRight]: tileData.rightTop.parts[0].frames.map((
      frame,
    ) => (keyToTile as any)[frame]),
    [AutotileDirection.Left]: tileData.left.parts[0].frames.map((frame) =>
      (keyToTile as any)[frame]
    ),
    [AutotileDirection.Center]: tileData.center.parts[0].frames.map((frame) =>
      (keyToTile as any)[frame]
    ),
    [AutotileDirection.Right]: tileData.right.parts[0].frames.map((frame) =>
      (keyToTile as any)[frame]
    ),
    [AutotileDirection.BottomLeft]: tileData.leftBottom.parts[0].frames.map((
      frame,
    ) => (keyToTile as any)[frame]),
    [AutotileDirection.Bottom]: tileData.bottom.parts[0].frames.map((frame) =>
      (keyToTile as any)[frame]
    ),
    [AutotileDirection.BottomRight]: tileData.rightBottom.parts[0].frames.map((
      frame,
    ) => (keyToTile as any)[frame]),
    [AutotileDirection.FillTopLeft]: tileData.fillLeftTop.parts[0].frames.map((
      frame,
    ) => (keyToTile as any)[frame]),
    [AutotileDirection.FillTopRight]: tileData.fillRightTop.parts[0].frames.map(
      (
        frame,
      ) => (keyToTile as any)[frame],
    ),
    [AutotileDirection.FillBottomLeft]: tileData.fillLeftBottom.parts[0].frames
      .map((
        frame,
      ) => (keyToTile as any)[frame]),
    [AutotileDirection.FillBottomRight]: tileData.fillRightBottom.parts[0]
      .frames.map((
        frame,
      ) => (keyToTile as any)[frame]),
  };
}

for (let i = 0; i < mapData.length; i += 14) {
  const tileId = mapData[i];
  tilemapData.tiles[`${Math.floor(i / (100 * 14)) - 50},${i / 14 % 100 - 50}`] =
    {
      autotileId: `autotile-${tileId}`,
    };
}

for (const mapObject of mapObjects as any) {
  const col = Math.round(mapObject.x / 256);
  const row = Math.round(mapObject.y / 256);
  const frame = (objectsData as any)[mapObject.objectIndex][mapObject.state]
    .parts[0][mapObject.direction].frames[mapObject.kind];
  //tilemapData.tiles[`${row},${col}`] = (keyToTile as any)[frame];
}

fs.writeFileSync(
  "../public/assets/optimized-tiles/tilemap.json",
  JSON.stringify(tilemapData, null, 2),
);
