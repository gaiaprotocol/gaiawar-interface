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
      wood: "",
      stone: "",
      iron: "",
      ducat: "",
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
