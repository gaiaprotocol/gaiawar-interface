import { Fadeable, Sprite } from "@gaiaengine/2d";
import { formatEther } from "viem";
import GameConfig from "../config/GaiaWarConfig.js";
import TokenAmount from "../data/token/TokenAmount.js";

export default class Loot extends Fadeable {
  constructor(loot: TokenAmount[]) {
    super(0, 0);
    const totalLootAmount = loot.reduce((acc, { amount }) => acc + amount, 0n);
    const totalLootCount = parseInt(formatEther(totalLootAmount / 1000n));

    const side = Math.ceil(Math.sqrt(totalLootCount));
    const cellSize = GameConfig.tileSize / side;

    let index = 0;
    for (let row = 0; row < side; row++) {
      for (let col = 0; col < side; col++) {
        if (index >= totalLootCount) break;

        const x = -GameConfig.tileSize / 2 + col * cellSize + cellSize / 2;
        const y = -GameConfig.tileSize / 2 + row * cellSize + cellSize / 2;

        this.append(new Sprite(x, y, "/assets/loot/loot.png"));
        index++;
      }
    }

    this.fadeIn(0.2);
  }
}
