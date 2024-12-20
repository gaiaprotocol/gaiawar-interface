import ChainType from "./ChainType.js";
import GameConfig from "./GameConfig.js";

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
      LootVault: "0xB3d09C16f066C9Fdc3546d021eFD0bF2201C8BBf",
      BuildingManager: "0x864C231b91B99a165a3ac9b60E2F84172Df960Af",
      UnitManager: "0x901e7cc6E1cF5E888223D4ccC84394783374d328",
      Battleground: "0xfde51cC2C839f680e00D3D480f152519BBE61b5F",
      Construct: "0x2ffdEEcDE0E5D2b52a18652C665d42c26D345E7B",
      UpgradeBuilding: "0x02F4082E1e23F7A95ebaD4B5E4008cD6c04d3f0e",
      Train: "0xf98ea55E0f7330abC5eC83Cd35176B68838aB0fB",
      UpgradeUnit: "0x5843Cf435b9Bc404BBE5E40F4Af445Df97FA2CB6",
      Move: "0xE80801cF717ce7E69665cC08EB8770605f631f2A",
      MoveAndAttack: "0xE810aaf9Ec7604D0D7A83D33C4fefFcC83Afc699",
      RangedAttack: "0x0Aa430E66Cab4946A65f3CBE67c34224016519d1",
    },
  };

  public getContractAddress(contract: ContractType) {
    return this.contractAddresses[GameConfig.isTestnet ? "testnet" : "mainnet"][
      contract
    ];
  }
}

export default new ContractAddressManager();
