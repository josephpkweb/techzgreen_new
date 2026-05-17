-- Add delivery_status + ensure expected_delivery and admin_notes columns exist
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'placed';

-- Sync delivery_status from existing shipped flag for existing rows
UPDATE public.orders SET delivery_status = 'shipped' WHERE shipped = true AND delivery_status = 'placed';

