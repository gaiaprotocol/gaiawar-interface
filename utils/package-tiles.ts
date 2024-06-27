import fs from "fs";
import path from "path";
import sharp, { Metadata, Sharp } from "sharp";
import objectsData from "./data/objects.json" assert { type: "json" };
import tilesData from "./data/tiles.json" assert { type: "json" };

const frames: string[] = [];
for (const tile of Object.values(tilesData)) {
  for (const p of Object.values(tile)) {
    for (const part of p.parts) {
      for (const frame of part.frames) {
        frames.push(frame);
      }
    }
  }
}

for (const object of Object.values(objectsData)) {
  for (const state of Object.values(object)) {
    for (const part of state.parts) {
      for (const p of Object.values(part)) {
        for (const frame of p.frames) {
          frames.push(frame);
        }
      }
    }
  }
}

const directoryPath = "../public/assets/raw-tiles";
const outputPath = "../public/assets/optimized-tiles";
const noAlphaTilesetImages: string[] = [];
const hasAlphaTilesetImages: string[] = [];
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
    key: string;
    row: number;
    col: number;
  };
} = {};

async function createTilesetImage(
  files: string[],
  outputFileName: string,
  format = "png",
) {
  const tileSize = 256;
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
    keyToTile[extractFilenames(file)[0]] = {
      key: outputFileName.replace(".png", "").replace(".jpg", ""),
      row,
      col,
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
      if (frames.includes(file.split(".")[0])) {
        const sharpImage = sharp(path.join(directoryPath, file));
        const metadata = await sharpImage.metadata();
        metadataMap.set(file, metadata);
        if (metadata.width !== 256 || metadata.height !== 256) {
          uniqueImages.push(file);
        } else {
          if (await hasTransparency(sharpImage)) {
            hasAlphaTilesetImages.push(path.join(directoryPath, file));
          } else {
            noAlphaTilesetImages.push(path.join(directoryPath, file));
          }
        }
      }
    }

    console.log(
      "Tileset images with transparency:",
      hasAlphaTilesetImages.length,
    );
    console.log(
      "Tileset images without transparency:",
      noAlphaTilesetImages.length,
    );
    console.log("Unique images:", uniqueImages.length);

    // 유니크 이미지들 개별 저장
    for (const file of uniqueImages) {
      const metadata = metadataMap.get(file);
      await sharp(path.join(directoryPath, file)).resize(
        Math.ceil(metadata!.width! / 4),
        Math.ceil(metadata!.height! / 4),
      ).extend({
        left: 128 - Math.ceil(metadata!.width! / 8),
        top: 128 - Math.ceil(metadata!.height! / 8),
        bottom: 128 - Math.ceil(metadata!.height! / 8),
        right: 128 - Math.ceil(metadata!.width! / 8),
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      }).toFile(path.join(outputPath, `unique-${file}`));
    }

    hasAlphaTilesetImages.push(
      ...uniqueImages.map((file) => path.join(outputPath, `unique-${file}`)),
    );

    // 알파 값이 있는 타일들을 하나의 이미지로 만들기
    await createTilesetImage(hasAlphaTilesetImages, "tileset-with-alpha.png");

    // 알파 값이 없는 타일들을 하나의 이미지로 만들기
    await createTilesetImage(
      noAlphaTilesetImages,
      "tileset-without-alpha.jpg",
      "jpeg",
    );

    fs.writeFileSync(
      path.join(outputPath, "key-to-tile.json"),
      JSON.stringify(keyToTile, null, 2),
    );

    console.log("All files have been processed and saved.");
  } catch (err) {
    console.error("An error occurred:", err);
  }
}

await processImages();
