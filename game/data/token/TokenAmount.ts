import TokenType from "./TokenType.js";

export default interface TokenAmount {
  tokenType: TokenType;
  tokenAddress: string;
  tokenId: bigint;
  amount: bigint;
}
