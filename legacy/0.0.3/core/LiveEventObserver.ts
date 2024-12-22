import { RealtimeChannel } from "@supabase/supabase-js";
import GameConfig from "../config/GaiaWarConfig.js";

class LiveEventObserver {
  private channel!: RealtimeChannel;

  public install() {
    this.channel = GameConfig.supabaseConnector.subscribeToBroadcast(
      "live_events",
      {
        "new_event": (message: any) => {
          console.log("New event received", message);
        },
      },
    );

    this.channel.send({
      type: "broadcast",
      event: "new_event",
      payload: { message: "Hello, world!" },
    });
  }
}

export default new LiveEventObserver();
