import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@common-module/app-components";
import { SocialCompConfig } from "@common-module/social-components";
import { AuthTokenManager, SupabaseConnector } from "@common-module/supabase";
import { WalletLoginConfig } from "@common-module/wallet-login";
import { GaiaEngineConfig } from "@gaiaengine/2d";
import { EthereumIcon, ProfileIcon } from "@gaiaprotocol/svg-icons";
import { GaiaUIPreset } from "@gaiaprotocol/ui-preset";
import { base, baseSepolia } from "@wagmi/core/chains";
import { GaiaProtocolConfig, MaterialContract } from "gaiaprotocol";
import { WalletModuleConfig } from "../../../wallet-module/lib/index.js";
import ChatMessageRepository from "../data/chat/ChatMessageRepository.js";
import MaterialType from "../data/material/MaterialType.js";
import UserInfoModal from "../ui/user/UserInfoModal.js";

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

  public tileSize = 256;
  public headquartersSearchRange = 7;
  public enemyBuildingSearchRange = 3;

  public init(config: IGameConfig) {
    Object.assign(this, config);
    GaiaUIPreset.init();

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
      ];
    };
  }
}

export default new GameConfig();
