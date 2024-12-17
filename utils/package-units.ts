import fs from "fs";
import path from "path";
import sharp from "sharp";
import frameData from "./raw-unit-images/framecounts.json" with {
  type: "json",
};
import { MaxRectsPacker } from "maxrects-packer";

interface SpritesheetData {
  frames: {
    [frame: string]: {
      frame: {
        x: number;
        y: number;
        w: number;
        h: number;
      };
      rotated: boolean;
      trimmed: boolean;
      spriteSourceSize: { x: number; y: number; w: number; h: number };
      sourceSize: { w: number; h: number };
    };
  };
  meta: {
    scale: number | string;
    image: string;
  };
}

const directoryPath = "./raw-unit-images";
const outputPath = "./optimized-unit-images";

async function processImages() {
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  const framesInfo: {
    id: string;
    unit: string;
    type: string;
    animation: string;
    frameIndex: number;
    width: number;
    height: number;
    buffer: Buffer;
  }[] = [];

  for (const [unit, frameCounts] of Object.entries(frameData)) {
    let unitPath;
    let types: string[];
    let prefix: string;

    if (unit.startsWith("heroknight")) {
      unitPath = "heroknight";
      types = [unit.substring(10)];
      prefix = "knight";
    } else {
      unitPath = unit;
      types = ["blue", "gray", "green", "red", "yellow"];
      prefix = unit;
    }

    for (const [animation, frameCount] of Object.entries(frameCounts)) {
      for (const type of types) {
        const imagePath = path.join(
          directoryPath,
          unitPath,
          type,
          `${prefix}${animation}.png`,
        );

        if (!fs.existsSync(imagePath)) {
          console.warn(`Image not found: ${imagePath}`);
          continue;
        }

        const image = sharp(imagePath);
        const metadata = await image.metadata();

        if (!metadata.width || !metadata.height) {
          console.warn(`Invalid metadata for image: ${imagePath}`);
          continue;
        }

        const imageWidth = metadata.width;
        const imageHeight = metadata.height;
        const baseFrameWidth = Math.floor(imageWidth / frameCount);

        for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
          let left = frameIndex * baseFrameWidth;
          let frameWidth = baseFrameWidth;

          // Adjust the last frame to include any remaining pixels
          if (frameIndex === frameCount - 1) {
            frameWidth = imageWidth - left;
          }

          // Ensure we don't extract beyond the image boundaries
          if (left + frameWidth > imageWidth) {
            frameWidth = imageWidth - left;
          }

          // Handle cases where frameWidth becomes zero or negative
          if (frameWidth <= 0) {
            console.warn(
              `Skipping frame ${frameIndex} for ${imagePath} - frameWidth <= 0`,
            );
            continue;
          }

          try {
            const frame = image.extract({
              left,
              top: 0,
              width: frameWidth,
              height: imageHeight,
            });

            const buffer = await frame.toBuffer();

            framesInfo.push({
              id: `${unit}_${type}_${animation}_${frameIndex}`,
              unit,
              type,
              animation,
              frameIndex,
              width: frameWidth,
              height: imageHeight,
              buffer,
            });
          } catch (error) {
            console.error(
              `Error extracting frame ${frameIndex} for ${imagePath}:`,
              error,
            );
          }
        }
      }
    }
  }

  // Use MaxRectsPacker to pack frames efficiently
  const packer = new MaxRectsPacker(2048, 2048, 2, {
    smart: true,
    pot: true, // Force power of two dimensions if needed
    square: false,
    allowRotation: false,
  });

  packer.addArray(framesInfo);

  let spritesheetIndex = 0;

  for (const bin of packer.bins) {
    const spritesheetImage = sharp({
      create: {
        width: bin.width,
        height: bin.height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    });

    const compositeOperations = bin.rects.map((rect) => ({
      input: rect.buffer,
      left: rect.x,
      top: rect.y,
    }));

    await spritesheetImage
      .composite(compositeOperations)
      .png()
      .toFile(path.join(outputPath, `unit_spritesheet_${spritesheetIndex}.png`));

    const spritesheetData: SpritesheetData = {
      frames: {},
      meta: {
        scale: 1,
        image: `unit_spritesheet_${spritesheetIndex}.png`,
      },
    };

    for (const rect of bin.rects) {
      spritesheetData.frames[rect.id] = {
        frame: {
          x: rect.x,
          y: rect.y,
          w: rect.width,
          h: rect.height,
        },
        rotated: false,
        trimmed: false,
        spriteSourceSize: {
          x: 0,
          y: 0,
          w: rect.width,
          h: rect.height,
        },
        sourceSize: {
          w: rect.width,
          h: rect.height,
        },
      };
    }

    fs.writeFileSync(
      path.join(outputPath, `unit_spritesheet_${spritesheetIndex}.json`),
      JSON.stringify(spritesheetData, null, 2),
    );

    console.log(`Created unit_spritesheet_${spritesheetIndex}.png and JSON data.`);
    spritesheetIndex++;
  }

  console.log("All unit images have been processed and packed.");
}

await processImages();