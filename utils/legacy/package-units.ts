import path from "path";
import sharp from "sharp";
import frameData from "./raw-unit-images/framecounts.json" with {
  type: "json",
};
import unitCenters from "./raw-unit-images/unitcenters.json" with {
  type: "json",
};
import fs from "fs";

interface SpritesheetData {
  frames: {
    [frame: string]: {
      frame: {
        x: number;
        y: number;
        w: number;
        h: number;
      };
      anchor: {
        x: number;
        y: number;
      };
    };
  };
  meta: {
    scale: number | string;
  };
  animations: {
    [animation: string]: string[];
  };
}

const directoryPath = "./raw-unit-images";
const outputPath = "./unit-images";

let maxWidth = 0;
let maxWidthUnit = "";
let maxHeight = 0;
let maxHeightUnit = "";

async function processImages() {
  const fullSpriteData: {
    [unit: string]: { [animation: string]: SpritesheetData };
  } = {};

  for (const [unit, frameCounts] of Object.entries(frameData)) {
    let newUnit = unit;
    if (unit === "axeman") {
      newUnit = "axe-warrior";
    } else if (unit === "shieldman") {
      newUnit = "shield-bearer";
    } else if (unit === "spy") {
      newUnit = "scout";
    } else if (unit === "camelry") {
      newUnit = "camel-rider";
    } else if (unit === "warelephant") {
      newUnit = "war-elephant";
    }

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
        let newType = type;
        if (type === "green") {
          newType = "player";
        } else if (type === "red") {
          newType = "enemy";
        } else if (type === "blue" || type === "gray" || type === "yellow") {
          continue;
        }

        const sharpImage = sharp(
          path.join(directoryPath, unitPath, type, `${prefix}${animation}.png`),
        );
        const metadata = await sharpImage.metadata();

        if (metadata.width! / frameCount > maxWidth) {
          maxWidth = metadata.width! / frameCount;
          maxWidthUnit = unit;
        }
        if (metadata.height! > maxHeight) {
          maxHeight = metadata.height!;
          maxHeightUnit = unit;
        }

        let newAnimation = animation;
        if (animation === "attack") {
          newAnimation = "ranged-attack";
        } else if (animation === "battle") {
          newAnimation = "attack";
        }

        const spritesheetData: SpritesheetData = {
          frames: {},
          meta: {
            scale: 1,
          },
          animations: {
            [newAnimation]: [],
          },
        };

        for (let i = 0; i < frameCount; i++) {
          const frameId = `${newAnimation}${i}`;
          const frame = {
            x: i * metadata.width! / frameCount,
            y: 0,
            w: metadata.width! / frameCount,
            h: metadata.height!,
          };
          const anchor = (unitCenters as any)[unit][animation];
          spritesheetData.frames[frameId] = { frame, anchor };
          spritesheetData.animations[newAnimation].push(frameId);
        }

        if (newUnit.startsWith("heroknight")) {
          fs.mkdirSync(path.join(outputPath, newUnit), { recursive: true });
          fs.copyFileSync(
            path.join(
              directoryPath,
              unitPath,
              type,
              `${prefix}${animation}.png`,
            ),
            path.join(outputPath, newUnit, `${newAnimation}.png`),
          );
        } else {
          fs.mkdirSync(path.join(outputPath, newUnit, newType), {
            recursive: true,
          });
          fs.copyFileSync(
            path.join(
              directoryPath,
              unitPath,
              type,
              `${prefix}${animation}.png`,
            ),
            path.join(outputPath, newUnit, newType, `${newAnimation}.png`),
          );
        }

        if (fullSpriteData[newUnit] === undefined) {
          fullSpriteData[newUnit] = {};
        }
        fullSpriteData[newUnit][newAnimation] = spritesheetData;
      }
    }
  }

  fs.writeFileSync(
    path.join(outputPath, "spritesheets.json"),
    JSON.stringify(fullSpriteData, null, 2),
  );

  console.log(
    `Max width: ${maxWidth} (${maxWidthUnit}) Max height: ${maxHeight} (${maxHeightUnit})`,
  );
}

await processImages();
