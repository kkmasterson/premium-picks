begin;
create table arena_private.dataset_jobs (
  competition_key text not null,
  dataset_key text not null,
  last_attempt_at timestamptz not null,
  last_success_at timestamptz,
  next_due_at timestamptz not null,
  status text not null check (status in ('running','succeeded','failed')),
  error_code text,
  primary key (competition_key,dataset_key)
);
alter table arena_private.dataset_jobs enable row level security;
revoke all on arena_private.dataset_jobs from public,anon,authenticated;
commit;
