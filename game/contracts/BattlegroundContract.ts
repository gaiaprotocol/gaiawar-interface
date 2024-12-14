import { WalletLoginManager } from "@common-module/wallet-login";
import { GaiaProtocolConfig } from "gaiaprotocol";
import GameConfig from "../GameConfig.js";
import BattlegroundArtifact from "./artifacts/Battleground.json" assert {
  type: "json"
};

class BattlegroundContract {
  public async getTileArea(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
  ) {
    return await WalletLoginManager.readContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: GameConfig.getContractAddress("Battleground"),
      abi: BattlegroundArtifact.abi,
      functionName: "getTileArea",
      args: [startX, startY, endX, endY],
    });
  }
}

export default new BattlegroundContract();
