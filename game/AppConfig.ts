import { GaiaEngineConfig } from "@gaiaengine/2d";

export interface IAppConfig {
  isDevMovde: boolean;
  isForSepolia: boolean;

  supabaseUrl: string;
  supabaseKey: string;
}

class AppConfig implements IAppConfig {
  public isDevMovde!: boolean;
  public isForSepolia!: boolean;
  public supabaseUrl!: string;
  public supabaseKey!: string;

  public init(config: IAppConfig) {
    Object.assign(this, config);

    GaiaEngineConfig.isDevMovde = config.isDevMovde;
  }
}

export default new AppConfig();
