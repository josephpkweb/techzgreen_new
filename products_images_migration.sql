-- Add image_urls array column to products table
-- Run in Supabase SQL Editor
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}';

-- Migrate existing image_url → image_urls[0] for any rows that already have one
UPDATE public.products
SET image_urls = ARRAY[image_url]
WHERE image_url IS NOT NULL AND image_url <> '' AND (image_urls IS NULL OR array_length(image_urls, 1) IS NULL);
