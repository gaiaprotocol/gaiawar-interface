import TokenAmount from "./token/TokenAmount.js";

export interface UnitQuantity {
  unitId: number;
  quantity: number;
}

export default interface TileData {
  occupant: `0x${string}`;
  buildingId: number;
  units: UnitQuantity[];
  loot: TokenAmount[];
}
