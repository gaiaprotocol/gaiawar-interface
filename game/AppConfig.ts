import { GaiaEngineConfig } from "@gaiaengine/2d";

export interface IAppConfig {
  isDevMovde: boolean;
}

class AppConfig implements IAppConfig {
  public isDevMovde!: boolean;

  public init(config: IAppConfig) {
    Object.assign(this, config);

    GaiaEngineConfig.isDevMovde = config.isDevMovde;
  }
}

export default new AppConfig();
