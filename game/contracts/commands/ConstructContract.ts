import { WalletLoginManager } from "@common-module/wallet-login";
import { GaiaProtocolConfig } from "gaiaprotocol";
import ContractAddressManager from "../../core/ContractAddressManager.js";
import ConstructionArtifact from "../artifacts/commands/Construct.json" assert {
  type: "json"
};

class ConstructContract {
  public async constructBuilding(x: number, y: number, buildingId: number) {
    await WalletLoginManager.writeContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: ContractAddressManager.getContractAddress("Construct"),
      abi: ConstructionArtifact.abi,
      functionName: "construct",
      args: [x, y, buildingId],
    });
  }
}

export default new ConstructContract();
