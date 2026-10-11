-- Week 4: Marketing Engine + Content System
-- Run this in the Supabase SQL Editor.

create table marketing_assets (
  id uuid primary key default gen_random_uuid(),
  asset_type text not null,
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table ab_votes (
  id uuid primary key default gen_random_uuid(),
  test_name text not null,
  variant text not null check (variant in ('A', 'B')),
  created_at timestamptz not null default now()
);

alter table marketing_assets enable row level security;
create policy "anon insert" on marketing_assets for insert to anon with check (true);
create policy "anon select" on marketing_assets for select to anon using (true);

alter table ab_votes enable row level security;
create policy "anon insert" on ab_votes for insert to anon with check (true);
create policy "anon select" on ab_votes for select to anon using (true);
