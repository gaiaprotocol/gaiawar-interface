import { WalletLoginManager } from "@common-module/wallet-login";
import { GaiaProtocolConfig } from "gaiaprotocol";
import ContractAddressManager from "../../config/ContractAddressManager.js";
import MaterialContractManager from "../../config/MaterialContractManager.js";
import UnitManagerArtifact from "../artifacts/data/UnitManager.json" with {
  type: "json"
};

class UnitManagerContract {
  public async getUnit(unitId: number) {
    const [
      prerequisiteUnitId,
      healthPoints,
      attackDamage,
      attackRange,
      movementRange,
      healthBoostPercentage,
      damageBoostPercentage,
      canBeTrained,
    ] = await WalletLoginManager.readContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: ContractAddressManager.getContractAddress("UnitManager"),
      abi: UnitManagerArtifact.abi,
      functionName: "units",
      args: [unitId],
    }) as [number, number, number, number, number, number, number, boolean];
    return {
      prerequisiteUnitId,
      healthPoints,
      attackDamage,
      attackRange,
      movementRange,
      healthBoostPercentage,
      damageBoostPercentage,
      canBeTrained,
    };
  }

  public async getTrainingBuildingIds(unitId: number) {
    return await WalletLoginManager.readContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: ContractAddressManager.getContractAddress("UnitManager"),
      abi: UnitManagerArtifact.abi,
      functionName: "getTrainingBuildingIds",
      args: [unitId],
    }) as number[];
  }

  public async getTrainingCost(unitId: number) {
    const tokenCosts: { tokenAddress: `0x${string}`; amount: bigint }[] =
      await WalletLoginManager.readContract({
        chainId: GaiaProtocolConfig.getChainId(),
        address: ContractAddressManager.getContractAddress("UnitManager"),
        abi: UnitManagerArtifact.abi,
        functionName: "getTrainingCost",
        args: [unitId],
      }) as { tokenAddress: `0x${string}`; amount: bigint }[];

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

export default new UnitManagerContract();
