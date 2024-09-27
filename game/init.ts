import { Router, SPAInitializer } from "@common-module/app";
import { AppCompConfig } from "@common-module/app-components";
import { MaterialLoadingSpinner } from "@common-module/material-loading-spinner";
import { SupabaseConnector } from "@common-module/supabase";
import { UniversalWalletConnector } from "@common-module/wallet";
import { WalletLoginManager } from "@common-module/wallet-login";
import AppConfig, { IAppConfig } from "./AppConfig.js";
import AppView from "./view/AppView.js";
import WorldManager from "./world/WorldManager.js";

export default async function init(config: IAppConfig) {
  AppConfig.init(config);
  AppCompConfig.LoadingSpinner = MaterialLoadingSpinner;
  SPAInitializer.init();

  SupabaseConnector.init(
    AppConfig.supabaseUrl,
    AppConfig.supabaseKey,
    WalletLoginManager,
  );

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

  Router.add("/", AppView);
}
