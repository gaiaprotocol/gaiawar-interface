import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import { GaiaProtocolConfig } from "gaiaprotocol";
import ContractAddressManager from "../../config/ContractAddressManager.js";
import TileData from "../../data/tile/TileData.js";
import BattlegroundArtifact from "../artifacts/core/Battleground.json" with {
  type: "json",
};

class BattlegroundContract {
  public async getTiles(from: Coordinates, to: Coordinates) {
    return await WalletLoginManager.readContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: ContractAddressManager.getContractAddress("Battleground"),
      abi: BattlegroundArtifact.abi,
      functionName: "getTiles",
      args: [from, to],
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
