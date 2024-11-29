import { Router, SPAInitializer } from "@common-module/app";
import { AppCompConfig } from "@common-module/app-components";
import { MaterialLoadingSpinner } from "@common-module/material-loading-spinner";
import { UniversalWalletConnector } from "@common-module/wallet";
import GameConfig, { IGameConfig } from "./GameConfig.js";
import GameView from "./view/GameView.js";
import WorldManager from "./world/WorldManager.js";
import { WalletLoginConfig } from "@common-module/wallet-login";

export default async function init(config: IGameConfig) {
  GameConfig.init(config);
  AppCompConfig.LoadingSpinner = MaterialLoadingSpinner;
  SPAInitializer.init();

  UniversalWalletConnector.init({
    name: "Gaia War",
    icon: "https://gaiawar.com/images/icon-192x192.png",
    description: "Onchain Strategy Game",
    walletConnectProjectId: "ddff9be202fe7448ae8d398034514a4d",
    chains: {
      "base-sepolia": {
        id: 84532,
        name: "Base Sepolia Testnet",
        symbol: "ETH",
        rpc: "https://sepolia.base.org",
        explorerUrl: "https://sepolia.basescan.org",
      },
    },
  });

  WorldManager.createWorld();

  Router.add("/", GameView);

  console.log(
    await WalletLoginConfig.supabaseConnector.callDbFunction(
      "get_login_wallet_address",
    ),
  );

  console.log(
    await GameConfig.supabaseConnector.callDbFunction(
      "get_login_wallet_address",
    ),
  );
}
