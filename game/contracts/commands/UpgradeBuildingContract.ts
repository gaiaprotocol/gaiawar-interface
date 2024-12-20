import { WalletLoginManager } from "@common-module/wallet-login";
import { GaiaProtocolConfig } from "gaiaprotocol";
import ContractAddressManager from "../../core/ContractAddressManager.js";
import UpgradeBuildingionArtifact from "../artifacts/commands/UpgradeBuilding.json" assert {
  type: "json",
};

class UpgradeBuildingContract {
  public async upgradeBuilding(x: number, y: number, buildingId: number) {
    await WalletLoginManager.writeContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: ContractAddressManager.getContractAddress("UpgradeBuilding"),
      abi: UpgradeBuildingionArtifact.abi,
      functionName: "upgradeBuilding",
      args: [x, y, buildingId],
    });
  }
}

export default new UpgradeBuildingContract();
