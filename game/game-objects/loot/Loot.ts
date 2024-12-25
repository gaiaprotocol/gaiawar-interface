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
    const totalLootAmount = loot.reduce((acc, { amount }) => acc + amount, 0n);
    const scaledLootAmount = formatEther(totalLootAmount / 1000n);

    let newCount = parseInt(scaledLootAmount);
    if (newCount === 0 && parseFloat(scaledLootAmount) > 0) newCount = 1;

    const oldCount = this.items.length;

    if (newCount > oldCount) {
      const diff = newCount - oldCount;
      for (let i = 0; i < diff; i++) {
        const newItem = new LootItem(0, 0).appendTo(this);
        this.items.push(newItem);
      }
    } else if (newCount < oldCount) {
      const diff = oldCount - newCount;
      const toRemove = this.items.splice(-diff, diff);
      for (const item of toRemove) {
        item.remove();
      }
    }

    this.repositionItems();
  }

  private repositionItems() {
    const totalLootCount = this.items.length;
    if (totalLootCount === 0) return;

    const side = Math.ceil(Math.sqrt(totalLootCount));
    const cellSize = GaiaWarConfig.tileSize / side;

    let index = 0;
    for (let row = 0; row < side; row++) {
      for (let col = 0; col < side; col++) {
        if (index >= totalLootCount) break;

        const x = -GaiaWarConfig.tileSize / 2 + col * cellSize + cellSize / 2;
        const y = -GaiaWarConfig.tileSize / 2 + row * cellSize + cellSize / 2;

        this.items[index].setPosition(x, y);

        index++;
      }
    }
  }
}
