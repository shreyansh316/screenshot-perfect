CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  headline text,
  location text,
  bio text,
  skills text[] NOT NULL DEFAULT '{}',
  interests text[] NOT NULL DEFAULT '{}',
  portfolio_url text,
  linkedin_url text,
  github_url text,
  availability text NOT NULL DEFAULT 'open',
  freelancer_intro text,
  experience_summary text,
  portfolio_projects jsonb NOT NULL DEFAULT '[]'::jsonb,
  email_updates boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own profile select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.saved_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  opportunity_id text NOT NULL,
  opportunity_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, opportunity_id)
);
GRANT SELECT, INSERT, DELETE ON public.saved_opportunities TO authenticated;
GRANT ALL ON public.saved_opportunities TO service_role;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own saved select" ON public.saved_opportunities FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own saved insert" ON public.saved_opportunities FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own saved delete" ON public.saved_opportunities FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  opportunity_id text NOT NULL,
  opportunity_type text NOT NULL,
  status text NOT NULL DEFAULT 'applied',
  cover_note text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, opportunity_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own apps select" ON public.applications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own apps insert" ON public.applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own apps update" ON public.applications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own apps delete" ON public.applications FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  title text NOT NULL DEFAULT 'My resume',
  template text NOT NULL DEFAULT 'classic',
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resumes TO authenticated;
GRANT ALL ON public.resumes TO service_role;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own resume select" ON public.resumes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own resume insert" ON public.resumes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own resume update" ON public.resumes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own resume delete" ON public.resumes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  topic text NOT NULL DEFAULT 'general',
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send contact message" ON public.contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(name) BETWEEN 1 AND 120 AND char_length(email) BETWEEN 3 AND 255 AND char_length(message) BETWEEN 1 AND 4000);

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER applications_touch BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER resumes_touch BEFORE UPDATE ON public.resumes FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();