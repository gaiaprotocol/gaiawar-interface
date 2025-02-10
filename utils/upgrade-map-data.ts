import { MapData, MapEntity, MapObjectData, TerrainData } from "@gaiaengine/2d";
import fs from "fs";
import oldMapData from "./legacy/optimized-tiles/map.json" with {
  type: "json",
};
import oldSpritesheetWithAlphaData from "./legacy/optimized-tiles/spritesheet-with-alpha.json" with {
  type: "json",
};
import oldSpritesheetWithoutAlphaData from "./legacy/optimized-tiles/spritesheet-without-alpha.json" with {
  type: "json",
};

const newMapData: MapData = {
  terrains: {},
  objects: {},
  terrainMap: {},
  mapObjects: [],
};

function convertTerrainDirection(oldDirection: any): MapEntity[] {
  const entities: MapEntity[] = [];
  for (const direction of oldDirection) {
    const oldFrame = direction.spritesheet === "spritesheet-with-alpha"
      ? (oldSpritesheetWithAlphaData.frames as any)[direction.frame].frame
      : (oldSpritesheetWithoutAlphaData.frames as any)[direction.frame].frame;
    const entity: MapEntity = {
      spritesheet: direction.spritesheet,
      frames: [{
        x: oldFrame.x,
        y: oldFrame.y,
        width: oldFrame.w,
        height: oldFrame.h,
      }],
    };
    entities.push(entity);
  }
  return entities;
}

for (const oldTerrainId in oldMapData.terrains) {
  const oldTerrain = (oldMapData.terrains as any)[oldTerrainId];
  const newTerrain: TerrainData = {
    drawingOrder: (Object.values(oldTerrain)[0] as any)[0].zIndex,
    directions: {
      "top-left": convertTerrainDirection(oldTerrain["top-left"]),
      "top": convertTerrainDirection(oldTerrain["top"]),
      "top-right": convertTerrainDirection(oldTerrain["top-right"]),
      "right": convertTerrainDirection(oldTerrain["right"]),
      "bottom-right": convertTerrainDirection(oldTerrain["bottom-right"]),
      "bottom": convertTerrainDirection(oldTerrain["bottom"]),
      "bottom-left": convertTerrainDirection(oldTerrain["bottom-left"]),
      "left": convertTerrainDirection(oldTerrain["left"]),
      "fill-top-bottom": convertTerrainDirection(oldTerrain["fill-top-bottom"]),
      "fill-left-right": convertTerrainDirection(oldTerrain["fill-left-right"]),
      "fill-top-left": convertTerrainDirection(oldTerrain["fill-top-left"]),
      "fill-top-right": convertTerrainDirection(oldTerrain["fill-top-right"]),
      "fill-bottom-right": convertTerrainDirection(
        oldTerrain["fill-bottom-right"],
      ),
      "fill-bottom-left": convertTerrainDirection(
        oldTerrain["fill-bottom-left"],
      ),
      "fill-top-left-right": convertTerrainDirection(
        oldTerrain["fill-top-left-right"],
      ),
      "fill-top-right-bottom": convertTerrainDirection(
        oldTerrain["fill-top-right-bottom"],
      ),
      "fill-bottom-left-right": convertTerrainDirection(
        oldTerrain["fill-bottom-left-right"],
      ),
      "fill-top-left-bottom": convertTerrainDirection(
        oldTerrain["fill-top-left-bottom"],
      ),
      "fill-full": convertTerrainDirection(oldTerrain["fill-full"]),
    },
  };
  newMapData.terrains[oldTerrainId] = newTerrain;
}

for (const oldObjectId in oldMapData.objects) {
  const oldObject = (oldMapData.objects as any)[oldObjectId];
  const oldFrame = oldObject.spritesheet === "spritesheet-with-alpha"
    ? (oldSpritesheetWithAlphaData.frames as any)[oldObject.frame].frame
    : (oldSpritesheetWithoutAlphaData.frames as any)[oldObject.frame].frame;
  const newObject: MapObjectData = {
    drawingOrder: oldObject.zIndex,
    spritesheet: oldObject.spritesheet,
    frames: [{
      x: oldFrame.x,
      y: oldFrame.y,
      width: oldFrame.w,
      height: oldFrame.h,
    }],
  };
  newMapData.objects[oldObjectId] = newObject;
}

newMapData.terrainMap = oldMapData.terrainMap;
newMapData.mapObjects = oldMapData.mapObjects.map((oldMapObject: any) => {
  return {
    x: oldMapObject.x,
    y: oldMapObject.y,
    object: oldMapObject.objectId,
  };
});

fs.writeFileSync(
  "./map.json",
  JSON.stringify(newMapData, null, 2),
);
