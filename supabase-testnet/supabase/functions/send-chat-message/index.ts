import { serve } from "https://raw.githubusercontent.com/yjgaia/deno-module/refs/heads/main/api.ts";
import { insert } from "https://raw.githubusercontent.com/yjgaia/supabase-module/refs/heads/main/deno/supabase.ts";
import { extractWalletAddressFromRequest } from "https://raw.githubusercontent.com/yjgaia/wallet-login-module/refs/heads/main/deno/auth.ts";

serve(async (req, ip) => {
  const walletAddress = extractWalletAddressFromRequest(req);
  const { content, clientId } = await req.json();

  const data = await insert(
    "chat_messages",
    { sender: walletAddress, client_id: clientId, content, ip_address: ip },
    "id",
  );

  return data.id;
});
