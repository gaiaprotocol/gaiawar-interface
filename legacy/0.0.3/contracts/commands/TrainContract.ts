import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import { GaiaProtocolConfig } from "gaiaprotocol";
import ContractAddressManager from "../../config/ContractAddressManager.js";
import { UnitQuantity } from "../../data/TileData.js";
import TrainArtifact from "../artifacts/commands/Train.json" assert {
  type: "json"
};

class TrainContract {
  public async train(
    coordinates: Coordinates,
    unitQuantity: UnitQuantity,
  ) {
    await WalletLoginManager.writeContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: ContractAddressManager.getContractAddress("Train"),
      abi: TrainArtifact.abi,
      functionName: "train",
      args: [coordinates, unitQuantity],
    });
  }
}

export default new TrainContract();
