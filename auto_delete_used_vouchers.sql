-- =====================================================
-- Auto-delete used user_vouchers after 1 day
-- Option A: Enable pg_cron first in Supabase Dashboard
--   Database → Extensions → pg_cron → Enable
--   Then run this entire file.
-- =====================================================

-- Step 1: Enable extension (run ONCE after enabling in dashboard)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Step 2: Schedule cleanup job
SELECT cron.schedule(
  'delete-used-vouchers-after-1d',
  '0 * * * *',   -- every hour
  $$
    DELETE FROM public.user_vouchers
    WHERE used_at IS NOT NULL
      AND used_at < NOW() - INTERVAL '1 day';
  $$
);

-- Verify:
-- SELECT * FROM cron.job WHERE jobname = 'delete-used-vouchers-after-1d';

-- Remove later:
-- SELECT cron.unschedule('delete-used-vouchers-after-1d');
