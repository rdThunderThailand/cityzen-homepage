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
  
  const [selectedProvince, setSelectedProvinceRaw] = useState<Province | null>(() => {
    try {
      const saved = localStorage.getItem("cityzen_province");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  
  const [selectedDistrict, setSelectedDistrictRaw] = useState<District | null>(() => {
    try {
      const saved = localStorage.getItem("cityzen_district");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  
  const [selectedSubdistrict, setSelectedSubdistrictRaw] = useState<Subdistrict | null>(() => {
    try {
      const saved = localStorage.getItem("cityzen_subdistrict");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  
  const [loading, setLoading] = useState(true);

  const setSelectedProvince = (province: Province | null) => {
    setSelectedProvinceRaw(province);
    if (province) localStorage.setItem("cityzen_province", JSON.stringify(province));
    else localStorage.removeItem("cityzen_province");

    setSelectedDistrictRaw(null);
    localStorage.removeItem("cityzen_district");
    
    setSelectedSubdistrictRaw(null);
    localStorage.removeItem("cityzen_subdistrict");
  };

  const setSelectedDistrict = (district: District | null) => {
    setSelectedDistrictRaw(district);
    if (district) localStorage.setItem("cityzen_district", JSON.stringify(district));
    else localStorage.removeItem("cityzen_district");

    setSelectedSubdistrictRaw(null);
    localStorage.removeItem("cityzen_subdistrict");
  };

  const setSelectedSubdistrict = (subdistrict: Subdistrict | null) => {
    setSelectedSubdistrictRaw(subdistrict);
    if (subdistrict) localStorage.setItem("cityzen_subdistrict", JSON.stringify(subdistrict));
    else localStorage.removeItem("cityzen_subdistrict");
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      const { data, error } = await supabase
        .from("provinces")
        .select("*")
        .order("name_th");

      if (!error && data) {
        setProvinces(data);
        setSelectedProvinceRaw(prev => {
          if (prev) return prev; // Keep the saved localized one
          const bangkok = data.find((p) => p.code === "10");
          return bangkok || null;
        });
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
