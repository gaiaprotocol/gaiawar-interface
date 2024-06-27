import { TilemapData } from "@gaiaengine/2d";
import fs from "fs";
import keyToTile from "../public/assets/optimized-tiles/key-to-tile.json" assert {
  type: "json",
};
import mapObjects from "./data/map-objects.json" assert { type: "json" };
import objectsData from "./data/objects.json" assert { type: "json" };
import tilesData from "./data/tiles.json" assert { type: "json" };

const mapData = fs.readFileSync("./data/map-tiles.txt", "utf-8");

const tilemapData: TilemapData = {
  tileSize: 256,
  tiles: [],
};

for (const tileId of mapData) {
  console.log((tilesData as any)[tileId]);
}

for (const mapObject of mapObjects as any) {
  const key = (objectsData as any)[mapObject.objectIndex][mapObject.state]
    .parts[0][mapObject.direction].frames[mapObject.kind];
  tilemapData.tiles.push({
    row: Math.round(mapObject.y / 256),
    col: Math.round(mapObject.x / 256),
    tileset: (keyToTile as any)[key],
  });
}

fs.writeFileSync(
  "../public/assets/optimized-tiles/tilemap.json",
  JSON.stringify(tilemapData, null, 2),
);
