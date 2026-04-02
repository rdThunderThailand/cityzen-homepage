import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
    enabled: !!provinceId,
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
    enabled: !!districtId,
  });
}
