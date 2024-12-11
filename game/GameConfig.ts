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
import ChatMessageRepository from "./chat/ChatMessageRepository.js";
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
      wood: "0x2E3b262256412fb2398aF82222721F1960715de3",
      stone: "0x501a023D3a477573A2590F75f7B0fe0F0F4B7982",
      iron: "0x158943c132507703D491778bD33c22fF5DB5Bf46",
      ducat: "0x8AD600DC65228C83d1a1ecE3a0BC1E9705406d57",
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

    ChatMessageRepository.supabaseConnector = this.supabaseConnector;

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
