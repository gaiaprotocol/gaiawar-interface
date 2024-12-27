import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import { GaiaProtocolConfig } from "gaiaprotocol";
import ContractAddressManager from "../../config/ContractAddressManager.js";
import { UnitQuantity } from "../../data/tile/TileData.js";
import MoveArtifact from "../artifacts/commands/Move.json" with {
  type: "json",
};

class MoveContract {
  public async move(
    from: Coordinates,
    to: Coordinates,
    units: UnitQuantity[],
  ) {
    await WalletLoginManager.writeContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: ContractAddressManager.getContractAddress("Move"),
      abi: MoveArtifact.abi,
      functionName: "move",
      args: [from, to, units],
    });
  }
}

export default new MoveContract();
