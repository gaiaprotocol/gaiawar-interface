import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import { GaiaProtocolConfig } from "gaiaprotocol";
import GameConfig from "../GameConfig.js";
import BattlegroundArtifact from "./artifacts/Battleground.json" assert {
  type: "json"
};

class BattlegroundContract {
  public async getTiles(coordinates: Coordinates[]) {
    return await WalletLoginManager.readContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: GameConfig.getContractAddress("Battleground"),
      abi: BattlegroundArtifact.abi,
      functionName: "getTiles",
      args: [coordinates],
    }) as { occupant: `0x${string}`; buildingId: number }[];
  }
}

export default new BattlegroundContract();
