-- 1. Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  national_id TEXT UNIQUE,
  full_name TEXT,
  phone_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  total_quota INT NOT NULL DEFAULT 0,
  remaining_quota INT NOT NULL DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  priority_conditions JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Projects are viewable by everyone." ON public.projects;
CREATE POLICY "Projects are viewable by everyone." ON public.projects FOR SELECT USING (true);

-- 3. Reservations
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  qr_code_data TEXT NOT NULL,
  status TEXT DEFAULT 'reserved' CHECK (status IN ('reserved', 'used', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ,
  UNIQUE(project_id, user_id)
);
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own reservations" ON public.reservations;
CREATE POLICY "Users can view own reservations" ON public.reservations FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create own reservations" ON public.reservations;
CREATE POLICY "Users can create own reservations" ON public.reservations FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own reservations" ON public.reservations;
CREATE POLICY "Users can update own reservations" ON public.reservations FOR UPDATE USING (auth.uid() = user_id);

-- 4. RPC
CREATE OR REPLACE FUNCTION public.reserve_project_quota(p_project_id UUID, p_user_id UUID, p_qr_data TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_remaining INT;
BEGIN
  SELECT remaining_quota INTO v_remaining FROM public.projects WHERE id = p_project_id FOR UPDATE;
  IF v_remaining > 0 THEN
    UPDATE public.projects SET remaining_quota = remaining_quota - 1 WHERE id = p_project_id;
    INSERT INTO public.reservations (project_id, user_id, qr_code_data, status)
    VALUES (p_project_id, p_user_id, p_qr_data, 'reserved');
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
EXCEPTION WHEN unique_violation THEN
  RETURN FALSE;
END;
$$;