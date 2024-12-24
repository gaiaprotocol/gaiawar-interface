import { EventContainer } from "@common-module/ts";
import { RealtimeChannel } from "@supabase/supabase-js";
import GaiaWarConfig from "../../config/GaiaWarConfig.js";
import PendingCommand from "./PendingCommand.js";

class PendingCommandManager extends EventContainer<{
  pendingCommandsChanged: (
    pendingCommands: Record<number, Record<number, PendingCommand[]>>,
  ) => void;
}> {
  private channel!: RealtimeChannel;
  private pendingCommands: Record<string, PendingCommand> = {};

  public init() {
    this.channel = GaiaWarConfig.supabaseConnector.subscribeToPresence(
      "pending-commands",
      { onSync: (state) => this.onSync(state) },
      this.pendingCommands,
    );
    return this;
  }

  private onSync(state: { [key: string]: Record<string, PendingCommand>[] }) {
    const pendingCommands: Record<number, Record<number, PendingCommand[]>> =
      {};
    for (const key in state) {
      for (const commands of state[key]) {
        for (const command of Object.values(commands)) {
          if (typeof command === "object") {
            if (!pendingCommands[command.to.x]) {
              pendingCommands[command.to.x] = {};
            }
            if (!pendingCommands[command.to.x][command.to.y]) {
              pendingCommands[command.to.x][command.to.y] = [];
            }
            pendingCommands[command.to.x][command.to.y].push(command);
          }
        }
      }
    }
    this.emit("pendingCommandsChanged", pendingCommands);
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
