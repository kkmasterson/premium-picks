begin;
-- Names are labels, not identity: the 1949 Denver Nuggets and today's franchise
-- have distinct provider IDs despite an identical full_name.
alter table public.canonical_teams drop constraint if exists canonical_teams_sport_key_name_key;
create index if not exists canonical_teams_name_idx on public.canonical_teams(sport_key,name);
commit;
