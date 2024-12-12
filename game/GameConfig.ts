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
      wood: "0x42382cfb8B5419F7567822D3b0b1ddC54B73385F",
      stone: "0x0Ee765a5367EB74f14b102e4FBDb63D297e2f614",
      iron: "0x5Da446bd659fF5F4313e3b16A38b3D208D42472a",
      ducat: "0xE8DA7c39749620dE752917b8Fd73771Ad271f127",
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
