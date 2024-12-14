import { WalletLoginManager } from "@common-module/wallet-login";
import { GaiaProtocolConfig } from "gaiaprotocol";
import GameConfig from "../../GameConfig.js";
import BuildingsArtifact from "../artifacts/entities/Buildings.json" assert {
  type: "json"
};

class BuildingsContract {
  public async getNextBuildingId() {
    return await WalletLoginManager.readContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: GameConfig.getContractAddress("Buildings"),
      abi: BuildingsArtifact.abi,
      functionName: "nextBuildingId",
    }) as number;
  }

  public async getBuilding(buildingId: number) {
    const [
      previousBuildingId,
      isHeadquarters,
      constructionRange,
      canBeConstructed,
    ] = await WalletLoginManager.readContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: GameConfig.getContractAddress("Buildings"),
      abi: BuildingsArtifact.abi,
      functionName: "buildings",
      args: [buildingId],
    }) as [number, boolean, number, boolean];
    return {
      previousBuildingId,
      isHeadquarters,
      constructionRange,
      canBeConstructed,
    };
  }

  public async getConstructionCosts(buildingId: number) {
    const tokenCosts: { tokenAddress: string; amount: bigint }[] =
      await WalletLoginManager.readContract({
        chainId: GaiaProtocolConfig.getChainId(),
        address: GameConfig.getContractAddress("Buildings"),
        abi: BuildingsArtifact.abi,
        functionName: "getConstructionCosts",
        args: [buildingId],
      }) as { tokenAddress: string; amount: bigint }[];

    const materialCosts: { [material: string]: bigint } = {};
    for (const tokenCost of tokenCosts) {
      const material = GameConfig.getMaterialNameByAddress(
        tokenCost.tokenAddress,
      );
      if (material) materialCosts[material] = tokenCost.amount;
    }

    return materialCosts;
  }
}

export default new BuildingsContract();
