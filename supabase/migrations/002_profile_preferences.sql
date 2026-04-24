-- TGTHR: Add preference columns to profiles
-- Run this in the Supabase SQL editor.

alter table public.profiles
  add column if not exists interests  text[] not null default '{}',
  add column if not exists drinks     text[] not null default '{}',
  add column if not exists diet_tags  text[] not null default '{}';
