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
      wood: "0xb1e50e052a2c5601BD92fddcc058ADDCFD44c6E7",
      stone: "0x63c45014DE5F0CbA76bbbA93A64D3d2DFd4f71cF",
      iron: "0x1605AE85E05B3E59Ae4728357DE39bAc81ed0277",
      ducat: "0x8D90c83bD9DBf0DB9D715378Bf4B7f3F5Ec749e5",
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
