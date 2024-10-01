import { GaiaEngineConfig } from "@gaiaengine/2d";

export interface IGameConfig {
  isDevMode: boolean;
  isForSepolia: boolean;

  supabaseUrl: string;
  supabaseKey: string;
}

class GameConfig implements IGameConfig {
  public isDevMode!: boolean;
  public isForSepolia!: boolean;
  public supabaseUrl!: string;
  public supabaseKey!: string;

  public init(config: IGameConfig) {
    Object.assign(this, config);

    GaiaEngineConfig.isDevMode = config.isDevMode;
  }
}

export default new GameConfig();
