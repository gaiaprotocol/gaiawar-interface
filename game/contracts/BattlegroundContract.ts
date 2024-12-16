import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import { GaiaProtocolConfig } from "gaiaprotocol";
import TileData from "../data/TileData.js";
import GameConfig from "../GameConfig.js";
import BattlegroundArtifact from "./artifacts/Battleground.json" assert {
  type: "json",
};

class BattlegroundContract {
  public async getTiles(coordinates: Coordinates[]) {
    return await WalletLoginManager.readContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: GameConfig.getContractAddress("Battleground"),
      abi: BattlegroundArtifact.abi,
      functionName: "getTiles",
      args: [coordinates],
    }) as TileData[];
  }

  public async hasHeadquarters(user: string) {
    return await WalletLoginManager.readContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: GameConfig.getContractAddress("Battleground"),
      abi: BattlegroundArtifact.abi,
      functionName: "hasHeadquarters",
      args: [user],
    }) as boolean;
  }
}

export default new BattlegroundContract();
