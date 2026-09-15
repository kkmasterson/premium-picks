begin;

-- Provider writes are served only by the Arena API. Deny direct browser access.
do $$ declare t text; begin
  foreach t in array array['providers','canonical_teams','canonical_players','provider_crosswalks',
    'canonical_events','canonical_markets','canonical_props','provider_offers','prop_snapshots',
    'metric_snapshots','calculation_runs','ingestion_deliveries','ingestion_quarantine','audit_log']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
  end loop;
end $$;

create schema if not exists arena_private;
revoke all on schema arena_private from public, anon, authenticated;
create table arena_private.schedule_generations (
  competition_key text primary key,
  payload jsonb not null,
  published_at timestamptz not null default now()
);

alter table public.canonical_events alter column starts_at drop not null;
alter table public.canonical_events add column game_date date;
alter table public.canonical_events add column lifecycle_state text not null default 'unknown'
  check (lifecycle_state in ('scheduled','in_progress','final','postponed','canceled','delayed','suspended','abandoned','unknown'));
alter table public.canonical_events add column home_score integer check (home_score >= 0);
alter table public.canonical_events add column away_score integer check (away_score >= 0);
alter table public.canonical_events add column last_delivery_id text references public.ingestion_deliveries(id);
alter table public.canonical_events add column last_observed_at timestamptz;
create index canonical_events_date_idx on public.canonical_events (competition_key, game_date);

insert into public.providers (key, name, adapter_version, enabled)
values ('balldontlie', 'BALLDONTLIE', 'nba-schedule-1', false)
on conflict (key) do nothing;

commit;
