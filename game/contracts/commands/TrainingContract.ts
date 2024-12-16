import { WalletLoginManager } from "@common-module/wallet-login";
import { GaiaProtocolConfig } from "gaiaprotocol";
import GameConfig from "../../GameConfig.js";
import TrainingArtifact from "../artifacts/commands/Training.json" assert {
  type: "json"
};

class TrainingContract {
  public async trainUnits(
    x: number,
    y: number,
    unitId: number,
    quantity: number,
  ) {
    await WalletLoginManager.writeContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: GameConfig.getContractAddress("Training"),
      abi: TrainingArtifact.abi,
      functionName: "trainUnits",
      args: [x, y, unitId, quantity],
    });
  }
}

export default new TrainingContract();
