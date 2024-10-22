import { AuthTokenManager, SupabaseConnector } from "@common-module/supabase";
import { GaiaEngineConfig } from "@gaiaengine/2d";
import { GaiaProtocolConfig } from "gaiaprotocol";

export interface IGameConfig {
  isDevMode: boolean;
  isTestnet: boolean;

  supabaseUrl: string;
  supabaseKey: string;
}

class GameConfig implements IGameConfig {
  public isDevMode!: boolean;
  public isTestnet!: boolean;

  public supabaseUrl!: string;
  public supabaseKey!: string;

  public supabaseConnector!: SupabaseConnector;

  public init(config: IGameConfig) {
    Object.assign(this, config);

    const authTokenManager = new AuthTokenManager("game-auth-token");

    this.supabaseConnector = new SupabaseConnector(
      config.supabaseUrl,
      config.supabaseKey,
      authTokenManager,
    );

    GaiaEngineConfig.isDevMode = config.isDevMode;

    GaiaProtocolConfig.init(
      config.isDevMode,
      config.isTestnet,
      this.supabaseConnector,
      authTokenManager,
    );
  }
}

export default new GameConfig();
