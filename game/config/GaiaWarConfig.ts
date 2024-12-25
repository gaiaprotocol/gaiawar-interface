import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@common-module/app-components";
import { SocialCompConfig } from "@common-module/social-components";
import { AuthTokenManager, SupabaseConnector } from "@common-module/supabase";
import { WalletLoginConfig } from "@common-module/wallet-login";
import { GaiaEngineConfig } from "@gaiaengine/2d";
import {
  EthereumIcon,
  ProfileIcon,
  SettingsIcon,
} from "@gaiaprotocol/svg-icons";
import { GaiaUIPreset } from "@gaiaprotocol/ui-preset";
import { base, baseSepolia } from "@wagmi/core/chains";
import { GaiaProtocolConfig } from "gaiaprotocol";
import { WalletModuleConfig } from "../../../wallet-module/lib/index.js";
import ChatMessageRepository from "../data/chat/ChatMessageRepository.js";
import SettingsModal from "../ui/settings/SettingsModal.js";
import UserInfoModal from "../ui/user/UserInfoModal.js";
import MaterialContractManager from "./MaterialContractManager.js";

export interface IGaiaWarConfig {
  isDevMode: boolean;
  isTestnet: boolean;

  supabaseUrl: string;
  supabaseKey: string;

  walletConnectProjectId: string;
}

class GaiaWarConfig {
  public readonly tileSize = 256;
  public readonly headquartersSearchRange = 7;
  public readonly enemyBuildingSearchRange = 3;
  public readonly maxUnitsPerTile = 50;

  public isDevMode!: boolean;
  public isTestnet!: boolean;

  public supabaseUrl!: string;
  public supabaseKey!: string;

  public supabaseConnector!: SupabaseConnector;

  public init(config: IGaiaWarConfig) {
    Object.assign(this, config);
    GaiaUIPreset.init();
    MaterialContractManager.init();

    const authTokenManager = new AuthTokenManager("gaiawar-auth-token");

    this.supabaseConnector = new SupabaseConnector(
      config.supabaseUrl,
      config.supabaseKey,
      authTokenManager,
    );

    ChatMessageRepository.supabaseConnector = this.supabaseConnector;

    WalletLoginConfig.init({
      chains: [
        config.isTestnet
          ? {
            ...baseSepolia,
            faucetUrl: "https://docs.base.org/docs/tools/network-faucets/",
          }
          : base,
      ] as any,
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
        WalletModuleConfig.chains[0].faucetUrl
          ? new DropdownMenuGroup(
            new DropdownMenuItem({
              icon: new EthereumIcon(),
              label: "Get Testnet ETH",
              onClick: () => {
                window.open(WalletModuleConfig.chains[0].faucetUrl);
                menu.remove();
              },
            }),
          )
          : undefined,
        new DropdownMenuGroup(
          new DropdownMenuItem({
            icon: new ProfileIcon(),
            label: "Profile",
            onClick: () => {
              new UserInfoModal(user.id);
              menu.remove();
            },
          }),
          new DropdownMenuItem({
            icon: new SettingsIcon(),
            label: "Settings",
            onClick: () => {
              new SettingsModal();
              menu.remove();
            },
          }),
        ),
      ];
    };
  }
}

export default new GaiaWarConfig();
