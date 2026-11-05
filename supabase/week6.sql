-- Week 6: Integrated venture site — demo usability tests
-- Already run in Supabase. This file documents the schema.

create table demo_tests (
  id uuid primary key default gen_random_uuid(),
  tester_label text not null,
  tester_role text not null,
  completed boolean not null,
  minutes_taken int null check (minutes_taken between 1 and 60),
  clarity_rating int not null check (clarity_rating between 1 and 5),
  value_rating int not null check (value_rating between 1 and 5),
  would_use boolean not null,
  issue_found text not null,
  suggestion text null,
  created_at timestamptz not null default now()
);

alter table demo_tests enable row level security;
create policy "anon insert" on demo_tests for insert to anon with check (true);
create policy "anon select" on demo_tests for select to anon using (true);
