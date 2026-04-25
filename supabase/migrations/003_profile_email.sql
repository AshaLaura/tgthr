-- TGTHR: Add email to profiles
-- Run this in the Supabase SQL editor.

alter table public.profiles
  add column if not exists email text;

-- Update the trigger so new sign-ups get their email stored automatically
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.email
  );
  return new;
end;
$$;

-- Backfill existing profiles from auth.users
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id
  and p.email is null
  and u.email is not null;
