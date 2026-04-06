import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  let token = Deno.env.get("MAPBOX_TOKEN") ?? "";
  
  // Strip any accidental "KEY_NAME=" prefix the user may have pasted
  const eqIdx = token.indexOf("=");
  if (eqIdx !== -1 && token.substring(eqIdx + 1).startsWith("pk.")) {
    token = token.substring(eqIdx + 1);
  }

  if (!token) {
    return new Response(JSON.stringify({ error: "Token not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ token }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
