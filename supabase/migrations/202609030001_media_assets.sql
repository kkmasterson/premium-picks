begin;

create type public.arena_media_asset_kind as enum ('player_headshot', 'team_badge', 'team_logo', 'sport_icon');
create type public.arena_media_variant as enum ('default', 'square', 'transparent', 'original');
create type public.arena_media_rights_status as enum ('pending', 'approved', 'restricted', 'expired');
create type public.arena_media_transform_policy as enum ('as_is', 'proportional_resize');

insert into public.providers (key, name, adapter_version, enabled)
values ('thesportsdb', 'TheSportsDB', 'media-fields-1', false)
on conflict (key) do nothing;

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.canonical_players(id),
  team_id uuid references public.canonical_teams(id),
  sport_key text,
  kind public.arena_media_asset_kind not null,
  variant public.arena_media_variant not null default 'default',
  source_provider_id uuid not null references public.providers(id),
  source_entity_id text not null,
  source_url text not null,
  object_uri text,
  cdn_url text,
  mime_type text check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  byte_size integer check (byte_size is null or byte_size > 0),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  sha256 text check (sha256 is null or sha256 ~ '^[a-f0-9]{64}$'),
  revision text not null,
  priority integer not null default 0 check (priority >= 0),
  rights_status public.arena_media_rights_status not null default 'pending',
  rights_reference text,
  rights_expires_at timestamptz,
  attribution_text text,
  attribution_url text,
  license_tag text,
  transform_policy public.arena_media_transform_policy not null,
  is_primary boolean not null default false,
  imported_at timestamptz not null default now(),
  effective_from timestamptz not null default now(),
  effective_to timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint media_assets_one_owner check (num_nonnulls(player_id, team_id, sport_key) = 1),
  constraint media_assets_kind_matches_owner check (
    (kind = 'player_headshot' and player_id is not null) or
    (kind in ('team_badge', 'team_logo') and team_id is not null) or
    (kind = 'sport_icon' and sport_key is not null)
  ),
  constraint media_assets_approved_object check (rights_status <> 'approved' or object_uri is not null),
  constraint media_assets_effective_window check (effective_to is null or effective_to > effective_from),
  unique nulls not distinct (player_id, team_id, sport_key, kind, variant, source_provider_id, source_entity_id, revision)
);

create index media_assets_player_idx on public.media_assets (player_id, kind, rights_status, priority) where player_id is not null and effective_to is null;
create index media_assets_team_idx on public.media_assets (team_id, kind, rights_status, priority) where team_id is not null and effective_to is null;
create index media_assets_sport_idx on public.media_assets (sport_key, kind, rights_status, priority) where sport_key is not null and effective_to is null;
create unique index media_assets_primary_player_idx on public.media_assets (player_id, kind) where player_id is not null and is_primary and effective_to is null;
create unique index media_assets_primary_team_idx on public.media_assets (team_id, kind) where team_id is not null and is_primary and effective_to is null;
create unique index media_assets_primary_sport_idx on public.media_assets (sport_key, kind) where sport_key is not null and is_primary and effective_to is null;

comment on column public.canonical_players.headshot_url is 'Transitional fixture field. Production read models resolve approved player_headshot rows from media_assets.';
comment on table public.media_assets is 'Rights-gated metadata for player headshots, team marks, and sport icons. Pending/restricted/expired rows must not enter public read models.';

alter table public.media_assets enable row level security;
create policy "service role manages media assets" on public.media_assets using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

commit;

-- Rollback: drop media_assets, then drop the four arena_media enum types.
