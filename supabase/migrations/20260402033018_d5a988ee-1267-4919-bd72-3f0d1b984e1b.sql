
-- Create provinces table
CREATE TABLE public.provinces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_th TEXT NOT NULL UNIQUE,
  name_en TEXT,
  code TEXT UNIQUE,
  geo_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create districts table
CREATE TABLE public.districts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  province_id UUID NOT NULL REFERENCES public.provinces(id) ON DELETE CASCADE,
  name_th TEXT NOT NULL,
  name_en TEXT,
  code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subdistricts table
CREATE TABLE public.subdistricts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  district_id UUID NOT NULL REFERENCES public.districts(id) ON DELETE CASCADE,
  name_th TEXT NOT NULL,
  name_en TEXT,
  code TEXT UNIQUE,
  zip_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subdistricts ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Provinces are publicly readable" ON public.provinces FOR SELECT USING (true);
CREATE POLICY "Districts are publicly readable" ON public.districts FOR SELECT USING (true);
CREATE POLICY "Subdistricts are publicly readable" ON public.subdistricts FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX idx_districts_province_id ON public.districts(province_id);
CREATE INDEX idx_subdistricts_district_id ON public.subdistricts(district_id);
CREATE INDEX idx_provinces_name_th ON public.provinces(name_th);
CREATE INDEX idx_districts_name_th ON public.districts(name_th);
