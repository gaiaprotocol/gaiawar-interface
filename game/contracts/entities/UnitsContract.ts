import { WalletLoginManager } from "@common-module/wallet-login";
import { GaiaProtocolConfig } from "gaiaprotocol";
import GameConfig from "../../GameConfig.js";
import UnitsArtifact from "../artifacts/entities/Units.json" assert {
  type: "json",
};

class UnitsContract {
  public async getUnit(unitId: number) {
    const [
      trainingBuildingIds,
      healthPoints,
      attackDamage,
      attackRange,
      movementRange,
      canBeTrained,
    ] = await WalletLoginManager.readContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: GameConfig.getContractAddress("Units"),
      abi: UnitsArtifact.abi,
      functionName: "units",
      args: [unitId],
    }) as [number[], number, number, number, number, boolean];
    return {
      trainingBuildingIds,
      healthPoints,
      attackDamage,
      attackRange,
      movementRange,
      canBeTrained,
    };
  }

  public async getTrainingCosts(unitId: number) {
    const tokenCosts: { tokenAddress: string; amount: bigint }[] =
      await WalletLoginManager.readContract({
        chainId: GaiaProtocolConfig.getChainId(),
        address: GameConfig.getContractAddress("Units"),
        abi: UnitsArtifact.abi,
        functionName: "getTrainingCosts",
        args: [unitId],
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

export default new UnitsContract();
