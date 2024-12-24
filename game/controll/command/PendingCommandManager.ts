import { RealtimeChannel } from "@supabase/supabase-js";
import GaiaWarConfig from "../../config/GaiaWarConfig.js";
import PendingCommand from "./PendingCommand.js";

class PendingCommandManager {
  private channel!: RealtimeChannel;
  private pendingCommands: Record<string, PendingCommand> = {};

  public init() {
    this.channel = GaiaWarConfig.supabaseConnector.subscribeToPresence(
      "pending-commands",
      {
        onSync: (state) => {
          console.log("sync", JSON.stringify(state));
        },
      },
      this.pendingCommands,
    );
  }

  private makeKey(pendingCommand: PendingCommand) {
    let key = `${pendingCommand.type}`;
    if (pendingCommand.from) {
      key += `-${pendingCommand.from.x},${pendingCommand.from.y}`;
    } else if (pendingCommand.to) {
      key += `-${pendingCommand.to.x},${pendingCommand.to.y}`;
    }
    return key;
  }

  public addPendingCommand(pendingCommand: PendingCommand) {
    this.pendingCommands[this.makeKey(pendingCommand)] = pendingCommand;
    this.channel.track(this.pendingCommands);
  }

  public removePendingCommand(pendingCommand: PendingCommand) {
    delete this.pendingCommands[this.makeKey(pendingCommand)];
    this.channel.track(this.pendingCommands);
  }
}

export default new PendingCommandManager();
