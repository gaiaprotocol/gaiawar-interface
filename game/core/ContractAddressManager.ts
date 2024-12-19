import GameConfig from "./GameConfig.js";

type ChainType = "mainnet" | "testnet";
type MaterialType = "wood" | "stone" | "iron" | "ducat";
type ContractType =
  | "LootVault"
  | "BuildingManager"
  | "UnitManager"
  | "Battleground"
  | "Construct"
  | "UpgradeBuilding"
  | "Train"
  | "UpgradeUnit"
  | "Move"
  | "MoveAndAttack"
  | "RangedAttack";

class ContractAddressManager {
  private materialAddresses: Record<
    ChainType,
    Record<MaterialType, `0x${string}`>
  > = {
    mainnet: {
      wood: "0x",
      stone: "0x",
      iron: "0x",
      ducat: "0x",
    },
    testnet: {
      wood: "0xFCDA5C6F9ECDA91E991Fe24C11A266C0a9EB158b",
      stone: "0x122481f4987038DFCE8a9F4A9bD1Ce2B53b7c051",
      iron: "0x482868a5E794beB808BdfAE0a658e8B3156046aC",
      ducat: "0xD163DACBa1F7eCd04897AD795Fb7752c0C466f93",
    },
  };

  private contractAddresses: Record<
    ChainType,
    Record<ContractType, `0x${string}`>
  > = {
    mainnet: {
      LootVault: "0x",
      BuildingManager: "0x",
      UnitManager: "0x",
      Battleground: "0x",
      Construct: "0x",
      UpgradeBuilding: "0x",
      Train: "0x",
      UpgradeUnit: "0x",
      Move: "0x",
      MoveAndAttack: "0x",
      RangedAttack: "0x",
    },
    testnet: {
      LootVault: "0xc4033E6991e82c5C2EBEB033129Ee6F1F6d5554c",
      BuildingManager: "0x3f1694b9877aD0736bEd75887Ac950E550260e1c",
      UnitManager: "0x9a2F907fFd5382aDaF61F10c2c3764155816b570",
      Battleground: "0x47e6010ef1d04B5F60a341fcac62CB158452D298",
      Construct: "0xBCF89848fC61D163798064383840A6Fa7A8594E3",
      UpgradeBuilding: "0xcF60549fb943b682Dd7E9f7649fea84d1ed5Eb2B",
      Train: "0xB4d5bA57c2f589851950d6C3512b6a18A12Aeb9b",
      UpgradeUnit: "0x9D4F0549319D1477D2B535FaFCEA59af429D8a39",
      Move: "0x954381Be392B2ba6919BF55A7197874dF2915426",
      MoveAndAttack: "0xa610ECcaCDB247C60ca3A4E3Ad93287D35F3fA18",
      RangedAttack: "0x5Aed8F6447fc4A0cd84fDDe8f736d77526EE2F52",
    },
  };

  public getContractAddress(contract: ContractType) {
    return this.contractAddresses[GameConfig.isTestnet ? "testnet" : "mainnet"][
      contract
    ];
  }

  public getMaterialAddress(material: MaterialType) {
    return this.materialAddresses[GameConfig.isTestnet ? "testnet" : "mainnet"][
      material
    ];
  }
}

export default new ContractAddressManager();
