import { RealtimeChannel } from "@supabase/supabase-js";
import GaiaWarConfig from "../../config/GaiaWarConfig.js";
import PendingCommand from "./PendingCommand.js";

class PendingCommandManager {
  private channel!: RealtimeChannel;
  private pendingCommands: PendingCommand[] = [];

  public init() {
    this.channel = GaiaWarConfig.supabaseConnector.subscribeToPresence(
      "pending-commands",
      { onSync: (state) => {} },
      this.pendingCommands,
    );
  }

  public addPendingCommand(pendingCommand: PendingCommand) {
    //TODO:
  }

  public removePendingCommand(pendingCommand: PendingCommand) {
    //TODO:
  }
}

export default new PendingCommandManager();
