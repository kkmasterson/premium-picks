begin;

create extension if not exists pgcrypto;
create extension if not exists pgmq;

create type public.arena_line_type as enum ('regular', 'goblin', 'devil', 'alternate');
create type public.arena_offer_status as enum ('active', 'suspended', 'stale', 'closed');
create type public.arena_event_phase as enum ('pregame', 'live', 'final');
create type public.arena_access_tier as enum ('tier1', 'tier2');

create table public.providers (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  adapter_version text not null,
  enabled boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.canonical_teams (
  id uuid primary key default gen_random_uuid(),
  sport_key text not null,
  name text not null,
  abbreviation text,
  created_at timestamptz not null default now(),
  unique (sport_key, name)
);

create table public.canonical_players (
  id uuid primary key default gen_random_uuid(),
  sport_key text not null,
  full_name text not null,
  team_id uuid references public.canonical_teams(id),
  headshot_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.provider_crosswalks (
  provider_id uuid not null references public.providers(id),
  entity_type text not null check (entity_type in ('player', 'team', 'event', 'market')),
  provider_entity_id text not null,
  canonical_entity_id uuid not null,
  mapping_version text not null,
  verified_at timestamptz,
  primary key (provider_id, entity_type, provider_entity_id)
);

create table public.canonical_events (
  id uuid primary key default gen_random_uuid(),
  competition_key text not null,
  home_team_id uuid references public.canonical_teams(id),
  away_team_id uuid references public.canonical_teams(id),
  starts_at timestamptz not null,
  phase public.arena_event_phase not null default 'pregame',
  status_label text,
  created_at timestamptz not null default now()
);

create table public.canonical_markets (
  id uuid primary key default gen_random_uuid(),
  sport_key text not null,
  key text not null,
  display_name text not null,
  unit text,
  unique (sport_key, key)
);

create table public.canonical_props (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.canonical_events(id),
  player_id uuid not null references public.canonical_players(id),
  market_id uuid not null references public.canonical_markets(id),
  period_key text not null default 'full',
  created_at timestamptz not null default now(),
  unique (event_id, player_id, market_id, period_key)
);

create table public.provider_offers (
  id uuid primary key default gen_random_uuid(),
  prop_id uuid not null references public.canonical_props(id),
  provider_id uuid not null references public.providers(id),
  provider_offer_id text not null,
  line_type public.arena_line_type not null,
  classification_rule_version text,
  line numeric not null,
  over_odds integer,
  under_odds integer,
  payout_multiplier numeric,
  status public.arena_offer_status not null,
  observed_at timestamptz not null,
  unique (provider_id, provider_offer_id)
);

create table public.prop_snapshots (
  id bigint generated always as identity primary key,
  prop_id uuid not null references public.canonical_props(id),
  offer_id uuid not null references public.provider_offers(id),
  side text not null check (side in ('over', 'under')),
  line numeric not null,
  odds integer,
  payout_multiplier numeric,
  status public.arena_offer_status not null,
  economic_fingerprint text not null,
  observed_at timestamptz not null,
  ingested_at timestamptz not null default now(),
  unique (offer_id, side, economic_fingerprint, observed_at)
);
create index prop_snapshots_history_idx on public.prop_snapshots (prop_id, offer_id, observed_at desc);

create table public.metric_snapshots (
  id bigint generated always as identity primary key,
  prop_id uuid not null references public.canonical_props(id),
  side text not null check (side in ('over', 'under')),
  line numeric not null,
  calculation_version text not null,
  input_cutoff timestamptz not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  unique (prop_id, side, line, calculation_version, input_cutoff)
);

create table public.calculation_runs (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  model_version text not null,
  input_cutoff timestamptz not null,
  status text not null check (status in ('started', 'completed', 'failed')),
  calibration_evidence_url text,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.ingestion_deliveries (
  id text primary key,
  provider_id uuid not null references public.providers(id),
  adapter_version text not null,
  payload_hash text not null,
  archive_key text not null,
  observed_at timestamptz not null,
  processed_at timestamptz,
  status text not null check (status in ('received', 'published', 'duplicate', 'quarantined', 'failed'))
);

create table public.ingestion_quarantine (
  id bigint generated always as identity primary key,
  delivery_id text not null references public.ingestion_deliveries(id),
  reason text not null,
  details jsonb not null default '{}'::jsonb,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_type text not null,
  actor_id text,
  action text not null,
  target_type text not null,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.user_entitlements (
  user_id uuid primary key,
  clerk_user_id text not null unique,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  tier public.arena_access_tier,
  status text not null default 'inactive',
  current_period_ends_at timestamptz,
  updated_at timestamptz not null default now()
);

select pgmq.create('provider_ingestion');
select pgmq.create('calculation_jobs');

alter table public.user_entitlements enable row level security;
create policy "service role manages entitlements" on public.user_entitlements using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

commit;

-- Rollback: drop queues with pgmq.drop_queue, then drop tables in reverse dependency order
-- and finally drop the four arena enum types. Production rollback must first preserve
-- append-only snapshots and audit records in the configured R2/database backup.
