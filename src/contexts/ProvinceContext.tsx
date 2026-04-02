import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Province {
  id: string;
  name_th: string;
  name_en: string | null;
  code: string | null;
  geo_id: number | null;
}

interface ProvinceContextType {
  provinces: Province[];
  selectedProvince: Province | null;
  setSelectedProvince: (province: Province | null) => void;
  loading: boolean;
}

const ProvinceContext = createContext<ProvinceContextType>({
  provinces: [],
  selectedProvince: null,
  setSelectedProvince: () => {},
  loading: true,
});

export const useProvince = () => useContext(ProvinceContext);

export const ProvinceProvider = ({ children }: { children: ReactNode }) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvinces = async () => {
      const { data, error } = await supabase
        .from("provinces")
        .select("*")
        .order("name_th");

      if (!error && data) {
        setProvinces(data);
        // Default to Bangkok
        const bangkok = data.find((p) => p.code === "10");
        if (bangkok) setSelectedProvince(bangkok);
      }
      setLoading(false);
    };
    fetchProvinces();
  }, []);

  return (
    <ProvinceContext.Provider value={{ provinces, selectedProvince, setSelectedProvince, loading }}>
      {children}
    </ProvinceContext.Provider>
  );
};
