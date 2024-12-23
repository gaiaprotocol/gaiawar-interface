import { WalletLoginManager } from "@common-module/wallet-login";
import BattlegroundContract from "../contracts/core/BattlegroundContract.js";

class ActionableAreaCalculator {
  public async calculateConstructableArea() {
    const user = WalletLoginManager.getLoggedInAddress();
    if (!user) return;

    const hasHeadquarters = await BattlegroundContract.hasHeadquarters(user);
  }

  public async calculateUnitActionableArea() {
  }
}

export default new ActionableAreaCalculator();
