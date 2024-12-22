import { RealtimeChannel } from "@supabase/supabase-js";
import GameConfig from "../core/GameConfig.js";

class LiveEventObserver {
  private channel!: RealtimeChannel;

  public install() {
    /*this.channel = GameConfig.supabaseConnector.channel("live_events").on(
      "live_event",
      { event: "sync" },
      () => {
        // Handle live event sync
      },
    ).subscribe(async (status, error) => {
      if (status === "SUBSCRIBED") {
        await this.track();
      }
      if (error) console.error(error);
    });*/
  }
}

export default new LiveEventObserver();
