
-- Create report status enum
CREATE TYPE public.report_status AS ENUM ('pending', 'reviewing', 'in_progress', 'resolved', 'rejected');

-- Create report type enum  
CREATE TYPE public.report_type AS ENUM ('road', 'electric', 'water', 'safety', 'other');

-- Create reports table
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  province_id UUID NOT NULL REFERENCES public.provinces(id),
  district_id UUID REFERENCES public.districts(id),
  subdistrict_id UUID REFERENCES public.subdistricts(id),
  report_type report_type NOT NULL DEFAULT 'other',
  title TEXT,
  description TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  status report_status NOT NULL DEFAULT 'pending',
  admin_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Anyone can create a report (even anonymous)
CREATE POLICY "Anyone can create reports" ON public.reports FOR INSERT WITH CHECK (true);

-- Users can view their own reports
CREATE POLICY "Users can view own reports" ON public.reports FOR SELECT USING (auth.uid() = user_id);

-- Anonymous reports are viewable by creator via id (handled in app)
CREATE POLICY "Public can view reports" ON public.reports FOR SELECT USING (true);

-- Indexes
CREATE INDEX idx_reports_province_id ON public.reports(province_id);
CREATE INDEX idx_reports_district_id ON public.reports(district_id);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX idx_reports_user_id ON public.reports(user_id);

-- Update timestamp trigger
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
