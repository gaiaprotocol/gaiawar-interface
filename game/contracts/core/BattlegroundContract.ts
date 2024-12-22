import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import { GaiaProtocolConfig } from "gaiaprotocol";
import ContractAddressManager from "../../config/ContractAddressManager.js";
import TileData from "../../data/tile/TileData.js";
import BattlegroundArtifact from "../artifacts/core/Battleground.json" assert {
  type: "json"
};

class BattlegroundContract {
  public async getTiles(coordinates: Coordinates[]) {
    return await WalletLoginManager.readContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: ContractAddressManager.getContractAddress("Battleground"),
      abi: BattlegroundArtifact.abi,
      functionName: "getTiles",
      args: [coordinates],
    }) as TileData[];
  }

  public async hasHeadquarters(user: string) {
    return await WalletLoginManager.readContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: ContractAddressManager.getContractAddress("Battleground"),
      abi: BattlegroundArtifact.abi,
      functionName: "hasHeadquarters",
      args: [user],
    }) as boolean;
  }

  public async collectLoot(coordinates: Coordinates) {
    await WalletLoginManager.writeContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: ContractAddressManager.getContractAddress("Battleground"),
      abi: BattlegroundArtifact.abi,
      functionName: "collectLoot",
      args: [coordinates],
    });
  }
}

export default new BattlegroundContract();
