import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import { GaiaProtocolConfig } from "gaiaprotocol";
import ContractAddressManager from "../../config/ContractAddressManager.js";
import { UnitQuantity } from "../../data/tile/TileData.js";
import MoveAndAttackArtifact from "../artifacts/commands/MoveAndAttack.json" with {
  type: "json"
};

class MoveAndAttackContract {
  public async moveAndAttack(
    from: Coordinates,
    to: Coordinates,
    units: UnitQuantity[],
  ) {
    await WalletLoginManager.writeContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: ContractAddressManager.getContractAddress("MoveAndAttack"),
      abi: MoveAndAttackArtifact.abi,
      functionName: "moveAndAttack",
      args: [from, to, units],
    });
  }
}

export default new MoveAndAttackContract();
