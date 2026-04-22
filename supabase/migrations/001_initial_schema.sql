-- TGTHR-005: Initial schema
-- Run this in the Supabase SQL editor.

-- ============================================================
-- TABLE: profiles
-- ============================================================
create table public.profiles (
  id              uuid references auth.users(id) on delete cascade primary key,
  display_name    text,
  planning_style  text check (planning_style in ('surprise', 'collaborative')),
  created_at      timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: owner select"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles: owner update"
  on public.profiles for update
  using (id = auth.uid());


-- ============================================================
-- TABLE: plans
-- ============================================================
create table public.plans (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid references public.profiles(id) on delete cascade not null,
  questionnaire_data   jsonb not null,
  plan_output          jsonb not null,
  city                 text check (city in ('sf', 'oak')),
  timing_day           text,
  timing_time_of_day   text check (timing_time_of_day in ('afternoon', 'evening', 'late night')),
  status               text not null default 'draft' check (status in ('draft', 'sent', 'confirmed')),
  partner_response     text check (partner_response in ('approved', 'tweaked')),
  created_at           timestamptz not null default now()
);

alter table public.plans enable row level security;

create policy "plans: owner select"
  on public.plans for select
  using (user_id = auth.uid());

create policy "plans: owner insert"
  on public.plans for insert
  with check (user_id = auth.uid());

create policy "plans: owner update"
  on public.plans for update
  using (user_id = auth.uid());


-- ============================================================
-- TABLE: partner_invites
-- ============================================================
create table public.partner_invites (
  id               uuid primary key default gen_random_uuid(),
  plan_id          uuid references public.plans(id) on delete cascade not null,
  token            text unique not null,
  expires_at       timestamptz not null,
  viewed_at        timestamptz,
  responded_at     timestamptz,
  response         text check (response in ('approved', 'tweaked')),
  partner_tweaks   jsonb
);

alter table public.partner_invites enable row level security;

-- Partners follow a token link — no account required to read or respond.
create policy "partner_invites: public select"
  on public.partner_invites for select
  using (true);

-- Only the plan owner can create an invite.
create policy "partner_invites: owner insert"
  on public.partner_invites for insert
  with check (
    exists (
      select 1 from public.plans
      where plans.id = plan_id
        and plans.user_id = auth.uid()
    )
  );

-- Partner can respond without an account (token is validated at app level).
create policy "partner_invites: public update"
  on public.partner_invites for update
  using (true);


-- ============================================================
-- AUTO-CREATE PROFILE ON SIGN-UP
-- Creates a row in profiles whenever a new user is added to auth.users.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
