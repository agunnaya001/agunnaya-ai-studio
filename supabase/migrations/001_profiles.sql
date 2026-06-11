-- ============================================================
-- Agunnaya AI Studio — initial schema
-- Run this in your Supabase project:
--   Dashboard → SQL Editor → New query → paste → Run
-- ============================================================

-- 1. profiles table (mirrors auth.users, safe for public access)
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email       TEXT,
  display_name TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read profiles (public leaderboard, community feed, etc.)
CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Only the trigger (SECURITY DEFINER) can insert — no direct client inserts
CREATE POLICY "profiles_insert_trigger"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

-- 3. Trigger function — fires when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data ->> 'display_name',
      NEW.raw_user_meta_data ->> 'full_name',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 4. Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5. Backfill any existing auth users that don't have a profile yet
INSERT INTO public.profiles (id, email, display_name)
SELECT
  id,
  email,
  COALESCE(
    raw_user_meta_data ->> 'display_name',
    raw_user_meta_data ->> 'full_name',
    split_part(email, '@', 1)
  )
FROM auth.users
ON CONFLICT (id) DO NOTHING;
