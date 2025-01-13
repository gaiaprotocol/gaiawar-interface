import { serve } from "https://raw.githubusercontent.com/yjgaia/deno-module/refs/heads/main/api.ts";
import { insert } from "https://raw.githubusercontent.com/yjgaia/supabase-module/refs/heads/main/deno/supabase.ts";
import { extractWalletAddressFromRequest } from "https://raw.githubusercontent.com/yjgaia/wallet-login-module/refs/heads/main/deno/auth.ts";

serve(async (req, ip) => {
  const walletAddress = extractWalletAddressFromRequest(req);
  const { content, clientId } = await req.json();

  if (typeof content !== "string" || typeof clientId !== "string") {
    throw new Error("Invalid input");
  }

  const data = await insert<
    {
      id: string;
      author: string;
      client_id: string;
      content: string;
      ip_address: string;
    }
  >(
    "chat_messages",
    { author: walletAddress, client_id: clientId, content, ip_address: ip },
    "id",
  );

  return data.id;
});
