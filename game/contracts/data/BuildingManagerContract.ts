import { WalletLoginManager } from "@common-module/wallet-login";
import { GaiaProtocolConfig } from "gaiaprotocol";
import ContractAddressManager from "../../core/ContractAddressManager.js";
import MaterialContractManager from "../../core/MaterialContractManager.js";
import BuildingManagerArtifact from "../artifacts/data/BuildingManager.json" assert {
  type: "json",
};
import TokenType from "../../core/TokenType.js";

class BuildingManagerContract {
  public async getNextBuildingId() {
    return await WalletLoginManager.readContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: ContractAddressManager.getContractAddress("BuildingManager"),
      abi: BuildingManagerArtifact.abi,
      functionName: "nextBuildingId",
    }) as number;
  }

  public async getBuilding(buildingId: number) {
    const [
      prerequisiteBuildingId,
      isHeadquarters,
      constructionRange,
      healthBoostPercentage,
      damageBoostPercentage,
      canBeConstructed,
    ] = await WalletLoginManager.readContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: ContractAddressManager.getContractAddress("BuildingManager"),
      abi: BuildingManagerArtifact.abi,
      functionName: "buildings",
      args: [buildingId],
    }) as [number, boolean, number, number, number, boolean];
    return {
      prerequisiteBuildingId,
      isHeadquarters,
      constructionRange,
      healthBoostPercentage,
      damageBoostPercentage,
      canBeConstructed,
    };
  }

  public async getConstructionCost(buildingId: number) {
    const tokenCosts = await WalletLoginManager.readContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: ContractAddressManager.getContractAddress("BuildingManager"),
      abi: BuildingManagerArtifact.abi,
      functionName: "getConstructionCost",
      args: [buildingId],
    }) as {
      tokenType: TokenType;
      tokenAddress: `0x${string}`;
      tokenId: bigint;
      amount: bigint;
    }[];

    const materialCosts: { [material: string]: bigint } = {};
    for (const tokenCost of tokenCosts) {
      const material = MaterialContractManager.getMaterialNameByAddress(
        tokenCost.tokenAddress,
      );
      if (material) materialCosts[material] = tokenCost.amount;
    }

    return materialCosts;
  }
}

export default new BuildingManagerContract();
