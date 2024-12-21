import { WalletLoginManager } from "@common-module/wallet-login";
import { Coordinates } from "@gaiaengine/2d";
import { GaiaProtocolConfig } from "gaiaprotocol";
import ContractAddressManager from "../../core/ContractAddressManager.js";
import { UnitQuantity } from "../../data/TileData.js";
import RangedAttackArtifact from "../artifacts/commands/RangedAttack.json" assert {
  type: "json",
};

class RangedAttackContract {
  public async rangedAttack(
    from: Coordinates,
    to: Coordinates,
    units: UnitQuantity[],
  ) {
    await WalletLoginManager.writeContract({
      chainId: GaiaProtocolConfig.getChainId(),
      address: ContractAddressManager.getContractAddress("RangedAttack"),
      abi: RangedAttackArtifact.abi,
      functionName: "rangedAttack",
      args: [from, to, units],
    });
  }
}

export default new RangedAttackContract();
