import { RealtimeChannel } from "@supabase/supabase-js";
import GameConfig from "../core/GameConfig.js";

class LiveEventObserver {
  private channel!: RealtimeChannel;

  public install() {
    this.channel = GameConfig.supabaseConnector.subscribeToPresence({
      channel: "live-events",
      onSync: (state) => {
        console.log(state);
      },
    });
  }
}

export default new LiveEventObserver();
