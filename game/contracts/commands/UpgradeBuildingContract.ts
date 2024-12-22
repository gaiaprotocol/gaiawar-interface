import { WalletLoginManager } from "@common-module/wallet-login";
import { GaiaProtocolConfig } from "gaiaprotocol";
import ContractAddressManager from "../../config/ContractAddressManager.js";
import UpgradeBuildingionArtifact from "../artifacts/commands/UpgradeBuilding.json" assert {
  type: "json",
};
import { Coordinates } from "@gaiaengine/2d";

class UpgradeBuildingContract {
  public async upgradeBuilding(coordinates: Coordinates, buildingId: number) {
    await WalletLoginManager.writeContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: ContractAddressManager.getContractAddress("UpgradeBuilding"),
      abi: UpgradeBuildingionArtifact.abi,
      functionName: "upgradeBuilding",
      args: [coordinates, buildingId],
    });
  }
}

export default new UpgradeBuildingContract();
