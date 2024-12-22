import GameConfig from "../core/GameConfig.js";

class LiveEventObserver {
  public install() {
    GameConfig.supabaseConnector.subscribeToPresence({
      channel: "live-events",
      onSync: (state) => {
        console.log(state);
      },
    }, {
      test: 123,
    });
  }
}

export default new LiveEventObserver();
