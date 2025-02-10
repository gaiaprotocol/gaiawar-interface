import { exec } from "child_process";
import FileUtils from "./FileUtils.js";

async function convertWav() {
  const files = await FileUtils.getAllFiles("../public/assets/sfx");
  for (const file of files) {
    if (file.endsWith(".mp3")) {
      const wavFile = file.replace(".mp3", ".wav");
      if (!await FileUtils.checkFileExists(wavFile)) {
        await new Promise<void>((resolve, reject) => {
          exec(`ffmpeg -i ${file} ${wavFile}`, (error) => {
            if (error !== null) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
        console.log(`Converted ${file} to ${wavFile}`);
      }
    }
  }
  console.log("Finished converting all files");
}

await convertWav();
