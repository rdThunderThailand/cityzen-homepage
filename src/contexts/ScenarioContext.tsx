import { createClient } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type ScenarioLevel = "normal" | "watch" | "crisis" | "lockdown";

export interface ScenarioMetadata {
  message?: string;
  affected_areas?: string[];
  instructions?: string;
  [key: string]: unknown;
}

export interface ScenarioState {
  level: ScenarioLevel;
  metadata: ScenarioMetadata;
  updatedAt: string | null;
  isLoading: boolean;
}

// ─── Thunder Core Supabase client (separate project from CityZen) ─────────────
const thunderSupabase = createClient(
  import.meta.env.VITE_THUNDER_SUPABASE_URL ?? "",
  import.meta.env.VITE_THUNDER_SUPABASE_ANON_KEY ?? ""
);

// ─── REST fetch ───────────────────────────────────────────────────────────────
async function fetchScenario(): Promise<ScenarioState> {
  const baseUrl = import.meta.env.VITE_THUNDER_CORE_BASE_URL;
  const appId   = import.meta.env.VITE_THUNDER_APP_ID;
  const apiKey  = import.meta.env.VITE_THUNDER_APP_API_KEY;

  if (!baseUrl || !appId || !apiKey) {
    return { level: "normal", metadata: {}, updatedAt: null, isLoading: false };
  }

  try {
    const res = await fetch(`${baseUrl}/api/applications/${appId}/scenario`, {
      headers: { "X-Api-Key": apiKey },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      level: (data.scenario_level as ScenarioLevel) ?? "normal",
      metadata: (data.scenario_metadata as ScenarioMetadata) ?? {},
      updatedAt: data.scenario_updated_at ?? null,
      isLoading: false,
    };
  } catch (e) {
    console.warn("[ScenarioContext] fetch failed, defaulting to normal:", e);
    return { level: "normal", metadata: {}, updatedAt: null, isLoading: false };
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ScenarioContext = createContext<ScenarioState>({
  level: "normal",
  metadata: {},
  updatedAt: null,
  isLoading: true,
});

export const useScenario = () => useContext(ScenarioContext);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ScenarioProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ScenarioState>({
    level: "normal",
    metadata: {},
    updatedAt: null,
    isLoading: true,
  });

  const applyPayload = useCallback((data: Record<string, unknown>) => {
    setState({
      level: (data.scenario_level as ScenarioLevel) ?? "normal",
      metadata: (data.scenario_metadata as ScenarioMetadata) ?? {},
      updatedAt: (data.scenario_updated_at as string) ?? null,
      isLoading: false,
    });
  }, []);

  // Initial REST fetch on mount
  useEffect(() => {
    fetchScenario().then(setState);
  }, []);

  // Supabase Realtime subscription for live updates
  useEffect(() => {
    const appId = import.meta.env.VITE_THUNDER_APP_ID;
    if (!appId) return;

    const channel = thunderSupabase
      .channel(`cityzen-scenario-${appId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "applications",
          filter: `id=eq.${appId}`,
        },
        (payload) => {
          console.log("[ScenarioContext] Realtime update:", payload.new);
          applyPayload(payload.new as Record<string, unknown>);
        }
      )
      .subscribe((status) => {
        console.log("[ScenarioContext] Realtime status:", status);
      });

    return () => {
      thunderSupabase.removeChannel(channel);
    };
  }, [applyPayload]);

  return (
    <ScenarioContext.Provider value={state}>
      {children}
    </ScenarioContext.Provider>
  );
};
