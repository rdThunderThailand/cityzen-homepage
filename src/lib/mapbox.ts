import { supabase } from "@/integrations/supabase/client";

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
