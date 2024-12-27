import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import { GaiaProtocolConfig } from "gaiaprotocol";
import ContractAddressManager from "../../config/ContractAddressManager.js";
import { UnitQuantity } from "../../data/tile/TileData.js";
import TrainArtifact from "../artifacts/commands/Train.json" with {
  type: "json"
};

class UpgradeUnitContract {
  public async upgradeUnit(
    coordinates: Coordinates,
    unitQuantity: UnitQuantity,
  ) {
    await WalletLoginManager.writeContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: ContractAddressManager.getContractAddress("UpgradeUnit"),
      abi: TrainArtifact.abi,
      functionName: "upgradeUnit",
      args: [coordinates, unitQuantity],
    });
  }
}

export default new UpgradeUnitContract();
