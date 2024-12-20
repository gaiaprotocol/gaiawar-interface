import { WalletLoginManager } from "@common-module/wallet-login";
import { GaiaProtocolConfig } from "gaiaprotocol";
import ContractAddressManager from "../../core/ContractAddressManager.js";
import TrainingArtifact from "../artifacts/commands/Train.json" assert {
  type: "json",
};

class TrainContract {
  public async trainUnits(
    x: number,
    y: number,
    unitId: number,
    quantity: number,
  ) {
    await WalletLoginManager.writeContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: ContractAddressManager.getContractAddress("Train"),
      abi: TrainingArtifact.abi,
      functionName: "train",
      args: [x, y, unitId, quantity],
    });
  }
}

export default new TrainContract();
