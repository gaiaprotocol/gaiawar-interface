export interface UnitQuantity {
  unitId: number;
  quantity: number;
}

export default interface TileData {
  owner: `0x${string}`;
  buildingId: number;
  units: UnitQuantity[];
}
