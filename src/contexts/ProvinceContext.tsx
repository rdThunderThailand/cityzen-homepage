import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Province {
  id: string;
  name_th: string;
  name_en: string | null;
  code: string | null;
  geo_id: number | null;
}

export interface District {
  id: string;
  name_th: string;
}

export interface Subdistrict {
  id: string;
  name_th: string;
  zip_code: string | null;
}

interface ProvinceContextType {
  provinces: Province[];
  selectedProvince: Province | null;
  setSelectedProvince: (province: Province | null) => void;
  selectedDistrict: District | null;
  setSelectedDistrict: (district: District | null) => void;
  selectedSubdistrict: Subdistrict | null;
  setSelectedSubdistrict: (subdistrict: Subdistrict | null) => void;
  loading: boolean;
}

const ProvinceContext = createContext<ProvinceContextType>({
  provinces: [],
  selectedProvince: null,
  setSelectedProvince: () => {},
  selectedDistrict: null,
  setSelectedDistrict: () => {},
  selectedSubdistrict: null,
  setSelectedSubdistrict: () => {},
  loading: true,
});

export const useProvince = () => useContext(ProvinceContext);

export const ProvinceProvider = ({ children }: { children: ReactNode }) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvinceRaw] = useState<Province | null>(null);
  const [selectedDistrict, setSelectedDistrictRaw] = useState<District | null>(null);
  const [selectedSubdistrict, setSelectedSubdistrictRaw] = useState<Subdistrict | null>(null);
  const [loading, setLoading] = useState(true);

  const setSelectedProvince = (province: Province | null) => {
    setSelectedProvinceRaw(province);
    setSelectedDistrictRaw(null);
    setSelectedSubdistrictRaw(null);
  };

  const setSelectedDistrict = (district: District | null) => {
    setSelectedDistrictRaw(district);
    setSelectedSubdistrictRaw(null);
  };

  const setSelectedSubdistrict = (subdistrict: Subdistrict | null) => {
    setSelectedSubdistrictRaw(subdistrict);
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      const { data, error } = await supabase
        .from("provinces")
        .select("*")
        .order("name_th");

      if (!error && data) {
        setProvinces(data);
        const bangkok = data.find((p) => p.code === "10");
        if (bangkok) setSelectedProvinceRaw(bangkok);
      }
      setLoading(false);
    };
    fetchProvinces();
  }, []);

  return (
    <ProvinceContext.Provider
      value={{
        provinces,
        selectedProvince,
        setSelectedProvince,
        selectedDistrict,
        setSelectedDistrict,
        selectedSubdistrict,
        setSelectedSubdistrict,
        loading,
      }}
    >
      {children}
    </ProvinceContext.Provider>
  );
};
