import { EventContainer } from "@common-module/ts";
import { WalletLoginManager } from "@common-module/wallet-login";
import MaterialContractManager from "../../config/MaterialContractManager.js";

class UserMaterialManager extends EventContainer<{
  balanceUpdated: (material: string, balance: bigint) => void;
}> {
  public userMaterialBalances: { [material: string]: bigint } = {
    wood: 0n,
    stone: 0n,
    iron: 0n,
    ducat: 0n,
  };

  constructor() {
    super();
    WalletLoginManager.on("loginStatusChanged", () => this.reloadBalances());
  }

  public async reloadBalances() {
    const walletAddress = WalletLoginManager.getLoggedInAddress();
    if (walletAddress) {
      await Promise.all(
        Object.entries(MaterialContractManager.materialContracts).map(
          async ([material, contract]) => {
            const balance = await contract.balanceOf(walletAddress);
            this.userMaterialBalances[material] = balance;
            this.emit("balanceUpdated", material, balance);
          },
        ),
      );
    }
  }
}

export default new UserMaterialManager();
