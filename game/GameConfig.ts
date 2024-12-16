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
import MaterialType from "./data/material/MaterialType.js";
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
      Battleground: "0x2C87b00E0436fB2f36c6a053bf4cB28D1fADF091",
      Buildings: "0xC911108F80B792A0E1f69FEd013b720CA1e49Dcd",
      Construction: "0xCb3428bA809B47d0cA7eC766d7d476986CF4fC10",
      Units: "0x2EEa1c806e7B56Fa1fb4E56Aa49F7Ada2D6bE294",
    },
  };

  public getContractAddress(
    contractName:
      | "Battleground"
      | "Buildings"
      | "Construction"
      | "Units",
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

  public materialContracts: Record<string, MaterialContract> = {};

  public getMaterialAddress(material: MaterialType) {
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

  public getMaterialContract(material: MaterialType) {
    return this.materialContracts[material];
  }

  public tileSize = 256;
  public headquartersSearchRange = 7;
  public enemyBuildingSearchRange = 3;

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
