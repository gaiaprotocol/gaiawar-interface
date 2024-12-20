export interface UnitQuantity {
  unitId: number;
  quantity: number;
}

enum TokenType {
  ERC20,
  ERC1155,
}

interface TokenAmount {
  tokenType: TokenType;
  tokenAddress: string;
  tokenId: bigint;
  amount: bigint;
}

export default interface TileData {
  occupant: `0x${string}`;
  buildingId: number;
  units: UnitQuantity[];
  loot: TokenAmount[];
}
