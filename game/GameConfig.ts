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
import { WalletModuleConfig } from "../../wallet-module/lib/index.js";
import ChatMessageRepository from "./data/chat/ChatMessageRepository.js";
import UserInfoModal from "./ui/user/UserInfoModal.js";

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

  private contractAddresses: Record<string, Record<string, `0x${string}`>> = {
    mainnet: {
      Buildings: "0x", //TODO:
      Battleground: "0x", //TODO:
      Construction: "0x", //TODO:
    },
    testnet: {
      Battleground: "0x2764105cbc52639985733CD18f770F09F6626280",
      Buildings: "0xC911108F80B792A0E1f69FEd013b720CA1e49Dcd",
      Construction: "0xA2033689D584EB0F5ca69490b27eF9B274f2F724",
    },
  };

  public getContractAddress(
    contractName:
      | "Buildings"
      | "Battleground"
      | "Construction",
  ) {
    return this.contractAddresses[this.isTestnet ? "testnet" : "mainnet"][
      contractName
    ];
  }

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

  public getMaterialNameByAddress(address: string) {
    for (
      const [material, addr] of Object.entries(
        this.materialAddresses[this.isTestnet ? "testnet" : "mainnet"],
      )
    ) {
      if (addr === address) {
        return material;
      }
    }
  }

  public materialContracts: Record<string, MaterialContract> = {};

  public tileSize = 256;

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
