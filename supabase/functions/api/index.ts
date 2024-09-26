import { startServer } from "https://raw.githubusercontent.com/yjgaia/deno-module/main/api.ts";
import { serveWalletApi } from "https://raw.githubusercontent.com/yjgaia/wallet-login-module/main/supabase/functions-module/serve-wallet-api.ts";

startServer(
  serveWalletApi,
);
