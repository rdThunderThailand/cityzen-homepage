import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Administrative boundary data (province/district/subdistrict) changes very
// rarely — cache aggressively to reduce Supabase round-trips at 100k users.
const GEO_STALE_MS = 60 * 60 * 1000;  // 60 min stale
const GEO_GC_MS    = 120 * 60 * 1000; // 120 min in memory

export function useDistricts(provinceId: string | undefined) {
  return useQuery({
    queryKey: ["districts", provinceId],
    queryFn: async () => {
      if (!provinceId) return [];
      const { data, error } = await supabase
        .from("districts")
        .select("id, name_th")
        .eq("province_id", provinceId)
        .order("name_th");
      if (error) throw error;
      return data;
    },
    enabled:   !!provinceId,
    staleTime: GEO_STALE_MS,
    gcTime:    GEO_GC_MS,
  });
}

export function useSubdistricts(districtId: string | undefined) {
  return useQuery({
    queryKey: ["subdistricts", districtId],
    queryFn: async () => {
      if (!districtId) return [];
      const { data, error } = await supabase
        .from("subdistricts")
        .select("id, name_th, zip_code")
        .eq("district_id", districtId)
        .order("name_th");
      if (error) throw error;
      return data;
    },
    enabled:   !!districtId,
    staleTime: GEO_STALE_MS,
    gcTime:    GEO_GC_MS,
  });
}
