begin;
-- Private prepared views. Browser roles cannot read raw payloads or credit ledgers.
create table arena_private.free_datasets (
  key text primary key, payload jsonb not null, published_at timestamptz not null default now()
);
create table arena_private.odds_observations (
  id bigint generated always as identity primary key,
  event_id uuid not null references public.canonical_events(id),
  observed_at timestamptz not null, payload jsonb not null
);
create index on arena_private.odds_observations(event_id, observed_at desc);
create table arena_private.odds_budget (
  month text primary key, reserved integer not null default 0 check (reserved >= 0),
  remaining integer, last_attempt_at timestamptz, last_checked_at timestamptz
);
create table arena_private.entity_enrichment (
  entity_id uuid primary key, provider_entity_id text not null,
  kind text not null check(kind in ('team','player','league')),
  payload jsonb not null, observed_at timestamptz not null default now()
);
alter table public.canonical_players alter column active drop not null;
alter table public.canonical_players alter column active drop default;
comment on column public.canonical_players.active is 'NULL means unknown. Free player directory is not an active roster.';
alter table arena_private.free_datasets enable row level security;
alter table arena_private.odds_observations enable row level security;
alter table arena_private.odds_budget enable row level security;
alter table arena_private.entity_enrichment enable row level security;
revoke all on arena_private.free_datasets,arena_private.odds_observations,arena_private.odds_budget,arena_private.entity_enrichment from public,anon,authenticated;
revoke all on sequence arena_private.odds_observations_id_seq from public,anon,authenticated;
commit;
