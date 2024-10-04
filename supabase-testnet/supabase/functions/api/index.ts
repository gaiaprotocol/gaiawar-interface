import { startServer } from "https://raw.githubusercontent.com/yjgaia/deno-module/refs/heads/main/api.ts";
import { serveWalletApi } from "https://raw.githubusercontent.com/yjgaia/wallet-login-module/main/deno/wallet.ts";
import { serveContractApi } from "https://raw.githubusercontent.com/yjgaia/contract-module/refs/heads/main/deno/contract.ts";

startServer(
  serveWalletApi,
  serveContractApi(
    {
      "base-sepolia": "https://sepolia.base.org",
    },
    {},
    {},
  ),
);
