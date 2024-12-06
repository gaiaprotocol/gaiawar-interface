import { SocialCompConfig } from "@common-module/social-components";
import { AuthTokenManager, SupabaseConnector } from "@common-module/supabase";
import { WalletLoginConfig } from "@common-module/wallet-login";
import { GaiaEngineConfig } from "@gaiaengine/2d";
import { GaiaUIPreset } from "@gaiaprotocol/ui-preset";
import { mainnet } from "@wagmi/core/chains";
import { GaiaProtocolConfig } from "gaiaprotocol";

export interface IGameConfig {
  isDevMode: boolean;
  isTestnet: boolean;

  supabaseUrl: string;
  supabaseKey: string;

  walletConnectProjectId: string;
}

class GameConfig {
  public isDevMode!: boolean;
  public isTestnet!: boolean;

  public supabaseUrl!: string;
  public supabaseKey!: string;

  public supabaseConnector!: SupabaseConnector;

  public materialAddresses: Record<string, Record<string, string>> = {
    mainnet: {
      wood: "",
      stone: "",
      iron: "",
      ducat: "",
    },
    testnet: {
      wood: "0xB9fA43F582f5b8A9Dc15129D0E5d61475399C84d",
      stone: "0xCA0c32a6bdd89b0595C0360d89be97325379397e",
      iron: "0xa7156113Bdbb4ff78749885b3C9E13d823c99424",
      ducat: "0x06ee2166F70105c2F83D4DD7885fCd8aE6D08aFf",
    },
  };

  public init(config: IGameConfig) {
    Object.assign(this, config);
    GaiaUIPreset.init();

    const authTokenManager = new AuthTokenManager("gaiawar-auth-token");

    this.supabaseConnector = new SupabaseConnector(
      config.supabaseUrl,
      config.supabaseKey,
      authTokenManager,
    );

    WalletLoginConfig.init({
      chains: [mainnet] as any,
      walletConnectProjectId: config.walletConnectProjectId,
      supabaseConnector: this.supabaseConnector,
    });

    GaiaEngineConfig.isDevMode = config.isDevMode;

    GaiaProtocolConfig.init(
      config.isDevMode,
      config.isTestnet,
      this.supabaseConnector,
      authTokenManager,
    );

    SocialCompConfig.goLoggedInUserProfile = async (user) => {
      //TODO: Implement this
    };

    SocialCompConfig.getLoggedInUserMenu = async (menu, user) => {
      return [];
    };
  }
}

export default new GameConfig();
