-- =====================================================
-- FIX: Partner RLS policies for user_vouchers
-- Run in Supabase SQL Editor → New query
-- =====================================================

-- 1. Drop old catch-all policy (if it existed but was overridden)
DROP POLICY IF EXISTS "All user_vouchers" ON public.user_vouchers;

-- 2. Users can read their own vouchers
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='user_vouchers' 
    AND policyname='Users read own vouchers'
  ) THEN
    CREATE POLICY "Users read own vouchers" ON public.user_vouchers
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- 3. Users can insert their own vouchers
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='user_vouchers' 
    AND policyname='Users insert own vouchers'
  ) THEN
    CREATE POLICY "Users insert own vouchers" ON public.user_vouchers
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 4. Approved partners can read ALL user_vouchers (to see active vouchers)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='user_vouchers' 
    AND policyname='Partners read all user_vouchers'
  ) THEN
    CREATE POLICY "Partners read all user_vouchers" ON public.user_vouchers
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.partner_profiles pp
          WHERE pp.user_id = auth.uid() AND pp.status = 'approved'
        )
      );
  END IF;
END $$;

-- 5. Approved partners can update user_vouchers (to mark as redeemed)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='user_vouchers' 
    AND policyname='Partners update user_vouchers'
  ) THEN
    CREATE POLICY "Partners update user_vouchers" ON public.user_vouchers
      FOR UPDATE USING (
        EXISTS (
          SELECT 1 FROM public.partner_profiles pp
          WHERE pp.user_id = auth.uid() AND pp.status = 'approved'
        )
      );
  END IF;
END $$;

-- 6. Admins can do everything
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='user_vouchers' 
    AND policyname='Admins all user_vouchers'
  ) THEN
    CREATE POLICY "Admins all user_vouchers" ON public.user_vouchers
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid() AND p.role = 'admin'
        )
      );
  END IF;
END $$;
