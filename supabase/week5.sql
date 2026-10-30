-- Week 5: Guided chat assistant
-- Run this in the Supabase SQL Editor.

create table chat_sessions (
  id uuid primary key default gen_random_uuid(),
  decision_type text null check (decision_type in ('housing', 'insurance', 'banking')),
  priority text null,
  situation text null,
  guardrail_category text null,
  human_checkpoint boolean not null default false,
  checkpoint_confirmed boolean not null default false,
  created_at timestamptz not null default now()
);

create table chat_feedback (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references chat_sessions(id),
  rating text not null check (rating in ('up', 'down')),
  comment text null check (char_length(comment) <= 200),
  created_at timestamptz not null default now()
);

create table chat_tests (
  id uuid primary key default gen_random_uuid(),
  tester_label text not null,
  tester_role text not null,
  decision_type text not null,
  completed boolean not null,
  rating int not null check (rating between 1 and 5),
  issue_found text not null,
  suggestion text null,
  created_at timestamptz not null default now()
);

alter table chat_sessions enable row level security;
create policy "anon insert" on chat_sessions for insert to anon with check (true);
create policy "anon select" on chat_sessions for select to anon using (true);

alter table chat_feedback enable row level security;
create policy "anon insert" on chat_feedback for insert to anon with check (true);
create policy "anon select" on chat_feedback for select to anon using (true);

alter table chat_tests enable row level security;
create policy "anon insert" on chat_tests for insert to anon with check (true);
create policy "anon select" on chat_tests for select to anon using (true);
