import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import { GaiaProtocolConfig } from "gaiaprotocol";
import ContractAddressManager from "../../config/ContractAddressManager.js";
import ConstructArtifact from "../artifacts/commands/Construct.json" assert {
  type: "json",
};

class ConstructContract {
  public async construct(coordinates: Coordinates, buildingId: number) {
    await WalletLoginManager.writeContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: ContractAddressManager.getContractAddress("Construct"),
      abi: ConstructArtifact.abi,
      functionName: "construct",
      args: [coordinates, buildingId],
    });
  }
}

export default new ConstructContract();
