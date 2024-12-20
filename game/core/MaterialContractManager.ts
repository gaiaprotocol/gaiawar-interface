import { MaterialContract } from "gaiaprotocol";
import ChainType from "./ChainType.js";
import GameConfig from "./GameConfig.js";

type MaterialType = "wood" | "stone" | "iron" | "ducat";

class MaterialContractManager {
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

  public getMaterialAddress(material: MaterialType) {
    return this.materialAddresses[GameConfig.isTestnet ? "testnet" : "mainnet"][
      material
    ];
  }

  public getMaterialNameByAddress(address: `0x${string}`) {
    for (
      const material in this
        .materialAddresses[GameConfig.isTestnet ? "testnet" : "mainnet"]
    ) {
      if (
        this.materialAddresses[GameConfig.isTestnet ? "testnet" : "mainnet"][
          material as MaterialType
        ] === address
      ) {
        return material;
      }
    }
    return undefined;
  }

  public materialContracts: Record<string, MaterialContract> = {};

  public init() {
    (["wood", "stone", "iron", "ducat"] as MaterialType[]).forEach(
      (material) => {
        this.materialContracts[material] = new MaterialContract(
          GameConfig.isTestnet
            ? this.materialAddresses.testnet[material]
            : this.materialAddresses.mainnet[material],
        );
      },
    );
  }
}

export default new MaterialContractManager();
