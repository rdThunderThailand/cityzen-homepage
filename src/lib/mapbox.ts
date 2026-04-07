import { supabase } from "@/integrations/supabase/client";

// Intercept Mapbox telemetry fetch to suppress ad-blocker ERR_CONNECTION_REFUSED logs
if (typeof window !== "undefined" && !(window as any).__mapboxTelemetrySilenced) {
  (window as any).__mapboxTelemetrySilenced = true;
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    try {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request | undefined)?.url;
      if (url && url.includes("events.mapbox.com")) {
        return new Response(JSON.stringify({}), { status: 200, headers: { "Content-Type": "application/json" } });
      }
    } catch { /* ignore */ }
    return originalFetch(...args);
  };
}

let cachedToken: string | null = null;

export async function getMapboxToken(): Promise<string> {
  if (cachedToken) return cachedToken;

  // Try VITE env var first (local dev)
  const envToken = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
  if (envToken) {
    cachedToken = envToken;
    return envToken;
  }

  // Fetch from edge function
  const { data, error } = await supabase.functions.invoke("get-mapbox-token");
  if (error || !data?.token) {
    throw new Error("Failed to fetch Mapbox token");
  }
  cachedToken = data.token;
  return data.token;
}
