
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can create reports" ON public.reports;
DROP POLICY IF EXISTS "Public can view reports" ON public.reports;
DROP POLICY IF EXISTS "Users can view own reports" ON public.reports;

-- Tighter INSERT: must have province_id and description
CREATE POLICY "Insert reports with required fields" ON public.reports 
  FOR INSERT WITH CHECK (province_id IS NOT NULL AND description IS NOT NULL);

-- Users can view their own reports  
CREATE POLICY "Users view own reports" ON public.reports 
  FOR SELECT USING (auth.uid() = user_id);

-- Anon can view reports (public transparency)
CREATE POLICY "Anon view reports" ON public.reports 
  FOR SELECT TO anon USING (true);
