-- Add delivery_status to orders for Flipkart-style tracking
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'placed'
  CHECK (delivery_status IN ('placed','confirmed','shipped','out','delivered'));
