import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";
import { serve } from "https://raw.githubusercontent.com/yjgaia/deno-module/refs/heads/main/api.ts";
import { sign } from "https://esm.sh/jsonwebtoken@8.5.1";

const GAIA_PROTOCOL_SUPABASE_URL = Deno.env.get("GAIA_PROTOCOL_SUPABASE_URL")!;
const GAIA_PROTOCOL_SUPABASE_KEY = Deno.env.get("GAIA_PROTOCOL_SUPABASE_KEY")!;
const JWT_SECRET = Deno.env.get("JWT_SECRET")!;

serve(async (req) => {
  const { token } = await req.json();
  if (!token) throw new Error("Missing required parameters");

  const gaiaProtocolSupabase = createClient(
    GAIA_PROTOCOL_SUPABASE_URL,
    GAIA_PROTOCOL_SUPABASE_KEY,
  );

  const { data: walletAddress, error } = await gaiaProtocolSupabase.functions
    .invoke(
      "verify-wallet-login-token",
      { body: { token } },
    );
  if (error) throw error;

  return sign({ wallet_address: walletAddress }, JWT_SECRET);
});
