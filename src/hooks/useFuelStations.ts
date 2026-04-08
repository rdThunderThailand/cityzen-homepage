/**
 * useFuelStations.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * React Query hook for fetching fuel station data from Thunder Core.
 *
 * Why this exists:
 *  - Moving fetch logic out of the component makes CityMap/CityMapPreview easier
 *    to read and test.
 *  - React Query handles deduplication: if both CityMap and CityMapPreview mount
 *    at the same time, only ONE network request is made.
 *  - With staleTime (inherited from QueryClient defaults = 5 min), data is NOT
 *    re-fetched on every navigation — critical at 100k users.
 *  - Built-in retry (2x) and error state management.
 */

import { useQuery } from "@tanstack/react-query";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface FuelType {
  id: string;
  code: string;
  name: string;
  color_code: string;
  sort_order: number;
}

export interface FuelStatus {
  is_available: boolean;
  price: number;
  updated_at: string;
  fuel_type: FuelType;
}

export interface FuelStation {
  id: string;
  name: string;
  brand: string;
  latitude: number;
  longitude: number;
  province: string;
  district?: string;
  address?: string;
  is_active: boolean;
  fuel_status: FuelStatus[];
}

// ─── Fetcher (pure function, easy to unit-test) ───────────────────────────────
const THUNDER_BASE = "/thunder-api";

async function fetchFuelStations(provinceName: string): Promise<FuelStation[]> {
  const url = `${THUNDER_BASE}/api/fuel/stations?province=${encodeURIComponent(provinceName)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fuel API ${res.status}`);
  const json = await res.json();
  return (json.data ?? json) as FuelStation[];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useFuelStations(provinceName: string | undefined) {
  return useQuery({
    queryKey: ["fuelStations", provinceName],
    queryFn:  () => fetchFuelStations(provinceName!),
    enabled:  !!provinceName,
    // Station availability changes often — override global staleTime to 3 min
    staleTime: 3 * 60 * 1000,
    // Return empty array instead of undefined while loading (simplifies consuming code)
    placeholderData: [],
  });
}
