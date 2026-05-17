-- site_settings table for admin-editable key-value config
-- Run this in Supabase SQL editor

create table if not exists public.site_settings (
  key   text primary key,
  value text not null default ''
);

-- Seed initial values
insert into public.site_settings (key, value)
values
  ('stat_waste',  '4.5T'),
  ('stat_zcoins', '8,000+')
on conflict (key) do nothing;

-- RLS: only service role / admins can write; public can read
alter table public.site_settings enable row level security;

create policy "Public read site_settings"
  on public.site_settings for select
  using (true);

create policy "Admin write site_settings"
  on public.site_settings for all
  using (auth.role() = 'authenticated');

-- Also add full_name and phone columns to profiles if not already present
-- (safe to run even if columns exist)
alter table public.profiles
  add column if not exists full_name text,
  add column if not exists phone     text;
