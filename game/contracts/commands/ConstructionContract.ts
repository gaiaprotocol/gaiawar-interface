import { WalletLoginManager } from "@common-module/wallet-login";
import { GaiaProtocolConfig } from "gaiaprotocol";
import GameConfig from "../../GameConfig.js";
import ConstructionArtifact from "../artifacts/commands/Construction.json" assert {
  type: "json",
};

class ConstructionContract {
  public async constructBuilding(x: number, y: number, buildingId: number) {
    await WalletLoginManager.writeContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: GameConfig.getContractAddress("Construction"),
      abi: ConstructionArtifact.abi,
      functionName: "constructBuilding",
      args: [x, y, buildingId],
    });
  }
}

export default new ConstructionContract();
