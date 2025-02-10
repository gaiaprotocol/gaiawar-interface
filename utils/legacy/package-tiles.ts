import fs from "fs";
import path from "path";
import sharp, { Metadata, Sharp } from "sharp";
import objectsData from "./data/objects.json" with { type: "json" };
import tilesData from "./data/tiles.json" with { type: "json" };

interface SpritesheetData {
  frames: {
    [frame: string]: {
      frame: {
        x: number;
        y: number;
        w: number;
        h: number;
      };
    };
  };
  meta: {
    scale: number | string;
  };
}

const zIndexes: { [key: string]: number } = {};
for (const tile of Object.values(tilesData)) {
  for (const p of Object.values(tile)) {
    for (const part of p.parts) {
      for (const frame of part.frames) {
        zIndexes[frame] = part.zIndex;
      }
    }
  }
}

for (const object of Object.values(objectsData)) {
  for (const state of Object.values(object)) {
    for (const part of state.parts) {
      for (const p of Object.values(part)) {
        for (const frame of p.frames) {
          zIndexes[frame] = p.zIndex;
        }
      }
    }
  }
}

const directoryPath = "./raw-tiles";
const outputPath = "./optimized-tiles";
const noAlphaSpritesheets: string[] = [];
const hasAlphaSpritesheets: string[] = [];
const uniqueImages: string[] = [];

async function hasTransparency(image: Sharp) {
  try {
    const stats = await image.stats();
    const hasAlpha = stats.channels.length === 4;
    if (!hasAlpha) return false;
    return stats.channels[3].min < 125;
  } catch (error) {
    console.error("이미지 처리 중 오류 발생:", error);
    return false;
  }
}

const extractFilenames = (input: string) => {
  const regex = /\/([^\/]+)\.png/g;
  const matches = input.match(regex);
  if (!matches) return [];
  return matches.map((match) => {
    const filename = match.split("/").pop()!.replace(".png", "");
    return filename.replace(/^unique-/, "").replace(/-/g, "");
  });
};

const keyToTile: {
  [filename: string]: {
    spritesheet: string;
    row: number;
    col: number;
    zIndex: number;
  };
} = {};

const keyToSpritesheet: {
  [filename: string]: {
    spritesheet: string;
    frame: string;
    zIndex: number;
  };
} = {};

const tileSize = 256;

async function createSpritesheetImage(
  files: string[],
  outputFileName: string,
  format = "png",
) {
  const tilesPerRow = Math.ceil(Math.sqrt(files.length));
  const outputWidth = tileSize * tilesPerRow;
  const outputHeight = tileSize * Math.ceil(files.length / tilesPerRow);

  const background = sharp({
    create: {
      width: outputWidth,
      height: outputHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  });

  const compositeOperations = files.map((file, index) => {
    const row = Math.floor(index / tilesPerRow);
    const col = index % tilesPerRow;
    const fileId = extractFilenames(file)[0];
    keyToTile[fileId] = {
      spritesheet: outputFileName.replace(".png", "").replace(".jpg", ""),
      row,
      col,
      zIndex: zIndexes[fileId],
    };
    return {
      input: file,
      top: row * tileSize,
      left: col * tileSize,
    };
  });

  if (format === "jpeg") {
    await background.composite(compositeOperations).jpeg({ quality: 60 })
      .toFile(path.join(outputPath, outputFileName));
  } else {
    await background
      .composite(compositeOperations)
      .toFile(path.join(outputPath, outputFileName));
  }

  console.log(`Created ${outputFileName}`);
}

async function processImages() {
  const metadataMap = new Map<string, Metadata>();

  try {
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const files = fs.readdirSync(directoryPath);
    for (const file of files) {
      if (zIndexes[file.split(".")[0]] !== undefined) {
        const sharpImage = sharp(path.join(directoryPath, file));
        const metadata = await sharpImage.metadata();
        metadataMap.set(file, metadata);
        if (metadata.width !== tileSize || metadata.height !== tileSize) {
          uniqueImages.push(file);
        } else {
          if (await hasTransparency(sharpImage)) {
            hasAlphaSpritesheets.push(path.join(directoryPath, file));
          } else {
            noAlphaSpritesheets.push(path.join(directoryPath, file));
          }
        }
      }
    }

    console.log(
      "Spritesheet images with transparency:",
      hasAlphaSpritesheets.length,
    );
    console.log(
      "Spritesheet images without transparency:",
      noAlphaSpritesheets.length,
    );
    console.log("Unique images:", uniqueImages.length);

    const uniqueKeys = [];

    // 유니크 이미지들 개별 저장
    for (const file of uniqueImages) {
      uniqueKeys.push(file.split(".")[0]);

      const metadata = metadataMap.get(file);
      await sharp(path.join(directoryPath, file)).resize(
        Math.ceil(metadata!.width! / 4),
        Math.ceil(metadata!.height! / 4),
      ).extend({
        left: tileSize / 2 - Math.ceil(metadata!.width! / 8),
        top: tileSize / 2 - Math.ceil(metadata!.height! / 8),
        bottom: tileSize / 2 - Math.ceil(metadata!.height! / 8),
        right: tileSize / 2 - Math.ceil(metadata!.width! / 8),
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      }).toFile(path.join(outputPath, `unique-${file}`));
    }

    hasAlphaSpritesheets.push(
      ...uniqueImages.map((file) => path.join(outputPath, `unique-${file}`)),
    );

    // 알파 값이 있는 타일들을 하나의 이미지로 만들기
    await createSpritesheetImage(
      hasAlphaSpritesheets,
      "spritesheet-with-alpha.png",
    );

    const spritesheetWithAlphaAtlas: SpritesheetData = {
      frames: {},
      meta: {
        scale: 1,
      },
    };

    let tileIndex = 0;
    let objectIndex = 0;

    for (const [key, tile] of Object.entries(keyToTile)) {
      if (tile.spritesheet === "spritesheet-with-alpha") {
        const frameId = uniqueKeys.includes(key)
          ? `object-${objectIndex++}`
          : `tile-${tileIndex++}`;

        spritesheetWithAlphaAtlas.frames[frameId] = {
          frame: {
            x: tile.col * tileSize,
            y: tile.row * tileSize,
            w: tileSize,
            h: tileSize,
          },
        };

        keyToSpritesheet[key] = {
          spritesheet: "spritesheet-with-alpha",
          frame: frameId,
          zIndex: tile.zIndex,
        };
      }
    }

    await createSpritesheetImage(
      noAlphaSpritesheets,
      "spritesheet-without-alpha.jpg",
      "jpeg",
    );

    const spritesheetWithoutAlphaAtlas: SpritesheetData = {
      frames: {},
      meta: {
        scale: 1,
      },
    };

    tileIndex = 0;

    for (const [key, tile] of Object.entries(keyToTile)) {
      if (tile.spritesheet === "spritesheet-without-alpha") {
        spritesheetWithoutAlphaAtlas.frames[`tile-${tileIndex++}`] = {
          frame: {
            x: tile.col * tileSize,
            y: tile.row * tileSize,
            w: tileSize,
            h: tileSize,
          },
        };

        keyToSpritesheet[key] = {
          spritesheet: "spritesheet-without-alpha",
          frame: `tile-${tileIndex - 1}`,
          zIndex: tile.zIndex,
        };
      }
    }

    fs.writeFileSync(
      path.join(outputPath, "spritesheet-with-alpha.json"),
      JSON.stringify(spritesheetWithAlphaAtlas, null, 2),
    );

    fs.writeFileSync(
      path.join(outputPath, "spritesheet-without-alpha.json"),
      JSON.stringify(spritesheetWithoutAlphaAtlas, null, 2),
    );

    fs.writeFileSync(
      path.join(outputPath, "key-to-spritesheet.json"),
      JSON.stringify(keyToSpritesheet, null, 2),
    );

    console.log("All files have been processed and saved.");
  } catch (err) {
    console.error("An error occurred:", err);
  }
}

await processImages();
