import { GameObject } from "@gaiaengine/2d";
import { formatEther } from "viem";
import GaiaWarConfig from "../../config/GaiaWarConfig.js";
import TokenAmount from "../../data/token/TokenAmount.js";
import LootItem from "./LootItem.js";

export default class Loot extends GameObject {
  private items: LootItem[] = [];

  constructor() {
    super(0, 0);
  }

  public setLoot(loot: TokenAmount[]) {
    for (const item of this.items) {
      item.remove();
    }

    const totalLootAmount = loot.reduce((acc, { amount }) => acc + amount, 0n);
    const totalLootCount = parseInt(formatEther(totalLootAmount / 1000n));

    const side = Math.ceil(Math.sqrt(totalLootCount));
    const cellSize = GaiaWarConfig.tileSize / side;

    let index = 0;
    for (let row = 0; row < side; row++) {
      for (let col = 0; col < side; col++) {
        if (index >= totalLootCount) break;

        const x = -GaiaWarConfig.tileSize / 2 + col * cellSize + cellSize / 2;
        const y = -GaiaWarConfig.tileSize / 2 + row * cellSize + cellSize / 2;

        const item = new LootItem(x, y).appendTo(this);
        this.items.push(item);

        index++;
      }
    }
  }
}
