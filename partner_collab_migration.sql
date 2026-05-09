-- =====================================================
-- PARTNER COLLAB + VOUCHER REDEMPTION MIGRATION
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Extend user_role enum to include 'partner'
DO $$ BEGIN
  ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'partner';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Partner Profiles table
CREATE TABLE IF NOT EXISTS public.partner_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  company_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  logo_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure status column exists in case the table was already created in a previous migration run
DO $$ BEGIN
  ALTER TABLE public.partner_profiles ADD COLUMN status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

ALTER TABLE public.partner_profiles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='partner_profiles' AND policyname='All partner_profiles') THEN
    CREATE POLICY "All partner_profiles" ON public.partner_profiles FOR ALL USING (true);
  END IF;
END $$;

-- 3. Enhance vouchers for partner support
ALTER TABLE public.vouchers
  ADD COLUMN IF NOT EXISTS discount_type TEXT NOT NULL DEFAULT 'percent'
    CHECK (discount_type IN ('flat', 'percent')),
  ADD COLUMN IF NOT EXISTS discount_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS user_limit INT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES public.partner_profiles(id) ON DELETE SET NULL;

-- Ensure user_limit column exists if the table was altered previously
DO $$ BEGIN
  ALTER TABLE public.vouchers ADD COLUMN user_limit INT NOT NULL DEFAULT 1;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Ensure date columns exist
DO $$ BEGIN
  ALTER TABLE public.vouchers ADD COLUMN start_date TIMESTAMPTZ;
  ALTER TABLE public.vouchers ADD COLUMN end_date TIMESTAMPTZ;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- 4. Extend user_vouchers table
ALTER TABLE public.user_vouchers
  ADD COLUMN IF NOT EXISTS qr_code TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT,
  ADD COLUMN IF NOT EXISTS used_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS used_by_partner_id UUID REFERENCES public.partner_profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS bill_amount DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS final_amount DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS settlement_amount DECIMAL(10,2);

-- Index for fast QR lookup
CREATE INDEX IF NOT EXISTS idx_user_vouchers_qr ON public.user_vouchers(qr_code);

-- 5. Backfill qr_code for existing rows that may be NULL
UPDATE public.user_vouchers SET qr_code = gen_random_uuid()::TEXT WHERE qr_code IS NULL;

-- 6. Also update profiles trigger to set role='partner' when we insert into partner_profiles
-- (We handle this in the app: admin manually creates auth user via Supabase dashboard,
--  then updates profiles.role to 'partner' and creates a partner_profiles row)

-- 7. Storage bucket for voucher images
INSERT INTO storage.buckets (id, name, public) VALUES ('vouchers', 'vouchers', true) ON CONFLICT DO NOTHING;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public Insert vouchers') THEN
    CREATE POLICY "Public Insert vouchers" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'vouchers');
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public Select vouchers') THEN
    CREATE POLICY "Public Select vouchers" ON storage.objects FOR SELECT TO public USING (bucket_id = 'vouchers');
  END IF;
END $$;
