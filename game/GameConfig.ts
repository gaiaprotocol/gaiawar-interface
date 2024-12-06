import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@common-module/app-components";
import { SocialCompConfig } from "@common-module/social-components";
import { AuthTokenManager, SupabaseConnector } from "@common-module/supabase";
import { WalletLoginConfig } from "@common-module/wallet-login";
import { GaiaEngineConfig } from "@gaiaengine/2d";
import { ProfileIcon } from "@gaiaprotocol/svg-icons";
import { GaiaUIPreset } from "@gaiaprotocol/ui-preset";
import { base, baseSepolia } from "@wagmi/core/chains";
import { GaiaProtocolConfig, MaterialContract } from "gaiaprotocol";
import UserInfoModal from "./components/UserInfoModal.js";

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

  private materialAddresses: Record<string, Record<string, `0x${string}`>> = {
    mainnet: {
      wood: "0x",
      stone: "0x",
      iron: "0x",
      ducat: "0x",
    },
    testnet: {
      wood: "0xB9fA43F582f5b8A9Dc15129D0E5d61475399C84d",
      stone: "0xCA0c32a6bdd89b0595C0360d89be97325379397e",
      iron: "0xa7156113Bdbb4ff78749885b3C9E13d823c99424",
      ducat: "0x06ee2166F70105c2F83D4DD7885fCd8aE6D08aFf",
    },
  };

  public getMaterialAddress(material: string) {
    return this
      .materialAddresses[this.isTestnet ? "testnet" : "mainnet"][material];
  }

  public materialContracts: Record<string, MaterialContract> = {};

  public init(config: IGameConfig) {
    Object.assign(this, config);
    GaiaUIPreset.init();

    ["wood", "stone", "iron", "ducat"].forEach((material) => {
      this.materialContracts[material] = new MaterialContract(
        config.isTestnet
          ? this.materialAddresses.testnet[material]
          : this.materialAddresses.mainnet[material],
      );
    });

    const authTokenManager = new AuthTokenManager("gaiawar-auth-token");

    this.supabaseConnector = new SupabaseConnector(
      config.supabaseUrl,
      config.supabaseKey,
      authTokenManager,
    );

    WalletLoginConfig.init({
      chains: [config.isTestnet ? baseSepolia : base] as any,
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

    SocialCompConfig.goLoggedInUserProfile = (user) =>
      new UserInfoModal(user.id);

    SocialCompConfig.getLoggedInUserMenu = async (menu, user) => {
      return [
        new DropdownMenuGroup(
          new DropdownMenuItem({
            icon: new ProfileIcon(),
            label: "Profile",
            onClick: () => {
              new UserInfoModal(user.id);
              menu.remove();
            },
          }),
        ),
      ];
    };
  }
}

export default new GameConfig();
