import type { PoolClient } from 'pg';
import { z } from 'zod';
import { DirectorySchema, type Directory } from '../../packages/contracts/src/free-data.js';
import { NbaClient, NbaTeamSchema, NbaPlayerSchema } from './nba-client.js';

export async function saveDataset(db: PoolClient, key: string, payload: unknown) {
  await db.query(`insert into arena_private.free_datasets(key,payload) values ($1,$2) on conflict(key) do update set payload=excluded.payload,published_at=now()`, [key, JSON.stringify(payload)]);
}
export async function loadDataset(db: PoolClient, key: string): Promise<unknown> {
  return (await db.query('select payload from arena_private.free_datasets where key=$1', [key])).rows[0]?.payload ?? null;
}
async function canonical(db: PoolClient, kind: 'team' | 'player', providerId: number, create: () => Promise<string>) {
  const { rows: [found] } = await db.query(`select canonical_entity_id from public.provider_crosswalks where provider_id=(select id from public.providers where key='balldontlie') and entity_type=$1 and provider_entity_id=$2`, [kind, String(providerId)]);
  if (found) return found.canonical_entity_id as string;
  const id = await create();
  await db.query(`insert into public.provider_crosswalks(provider_id,entity_type,provider_entity_id,canonical_entity_id,mapping_version,verified_at) values ((select id from public.providers where key='balldontlie'),$1,$2,$3,'nba-directory-1',now())`, [kind, String(providerId), id]);
  return id;
}
async function mapTeam(db: PoolClient, team: z.infer<typeof NbaTeamSchema>): Promise<Directory['teams'][number]> {
  const id = await canonical(db, 'team', team.id, async () => (await db.query(`insert into public.canonical_teams(sport_key,name,abbreviation) values ('basketball',$1,$2) returning id`, [team.full_name, team.abbreviation])).rows[0].id);
  return { id, name: team.full_name, abbreviation: team.abbreviation, city: team.city ?? '', conference: team.conference ?? '', division: team.division ?? '', image: null, venue: null };
}

/** Repair older name-based team aliases using archived provider IDs, no API calls. */
export async function repairDirectoryIdentity(db: PoolClient) {
  const directory = DirectorySchema.parse(await loadDataset(db, 'directory'));
  if (!directory.complete) throw new Error('directory_import_in_progress');
  const rawTeams = NbaTeamSchema.array().parse(await loadDataset(db, 'directory-raw-teams'));
  await db.query('begin');
  try {
    const seen = new Set<string>();
    for (const team of rawTeams) {
      const mapped = await mapTeam(db, team);
      if (seen.has(mapped.id)) {
        const id = (await db.query("insert into public.canonical_teams(sport_key,name,abbreviation) values ('basketball',$1,$2) returning id", [team.full_name, team.abbreviation])).rows[0].id;
        await db.query("update public.provider_crosswalks set canonical_entity_id=$1,mapping_version='nba-directory-2' where provider_id=(select id from public.providers where key='balldontlie') and entity_type='team' and provider_entity_id=$2", [id, String(team.id)]);
      }
      seen.add(mapped.id);
    }
    directory.teams = [];
    for (const team of rawTeams) directory.teams.push(await mapTeam(db, team));
    const pages = (await db.query("select payload from arena_private.free_datasets where key like 'directory-raw-page-%'")).rows;
    const players = new Map<string, Directory['players'][number]>();
    for (const page of pages) for (const raw of NbaPlayerSchema.array().parse(page.payload.data)) {
      const p = await mapPlayer(db, raw, directory.teams); players.set(p.id, p);
    }
    directory.players = [...players.values()].sort((a, b) => a.name.localeCompare(b.name));
    await saveDataset(db, 'directory', DirectorySchema.parse(directory));
    await db.query('commit');
    return { teams: directory.teams.length, players: directory.players.length, uniqueTeamIds: new Set(directory.teams.map((t) => t.id)).size };
  } catch (error) { await db.query('rollback'); throw error; }
}
async function mapPlayer(db: PoolClient, player: z.infer<typeof NbaPlayerSchema>, teams: Directory['teams']) {
  // Resolve team through its verified provider crosswalk, never a player-name join.
  const team = player.team ? await mapTeam(db, player.team) : null;
  if (team && !teams.some((t) => t.id === team.id)) teams.push(team);
  const name = `${player.first_name} ${player.last_name}`.trim();
  const id = await canonical(db, 'player', player.id, async () => (await db.query(`insert into public.canonical_players(sport_key,full_name,team_id,active) values ('basketball',$1,$2,null) returning id`, [name, team?.id ?? null])).rows[0].id);
  await db.query('update public.canonical_players set full_name=$2,team_id=$3,active=null where id=$1', [id, name, team?.id ?? null]);
  return { id, name, teamId: team?.id ?? null, position: player.position, height: player.height ?? null, country: player.country ?? null, image: null };
}

/** Resumable page imports. The public view explicitly marks incomplete coverage. */
export async function importDirectory(db: PoolClient, client: NbaClient) {
  const checkpoint = z.object({ cursor: z.number().optional(), complete: z.boolean(), startedAt: z.string(), seen: z.array(z.number()) }).nullable().parse(await loadDataset(db, 'directory-cursor'));
  if (checkpoint?.complete && Date.now() - Date.parse(checkpoint.startedAt) < 30 * 86400000) return { status: 'not_due' };
  const existing = DirectorySchema.nullable().parse(await loadDataset(db, 'directory'));
  let directory: Directory = checkpoint && !checkpoint.complete && existing ? existing : { observedAt: new Date().toISOString(), complete: false, teams: [], players: [], leagueImage: null };
  const startedAt = checkpoint && !checkpoint.complete ? checkpoint.startedAt : new Date().toISOString();
  let cursor = checkpoint && !checkpoint.complete ? checkpoint.cursor : undefined;
  const seen = checkpoint && !checkpoint.complete ? checkpoint.seen : [];
  if (!directory.teams.length) {
    const rawTeams = await client.teams();
    await db.query('begin');
    try {
      for (const team of rawTeams) directory.teams.push(await mapTeam(db, team));
      await saveDataset(db, 'directory-raw-teams', rawTeams);
      await saveDataset(db, 'directory', directory);
      await saveDataset(db, 'directory-cursor', { complete: false, startedAt, seen });
      await db.query('commit');
    } catch (error) { await db.query('rollback'); throw error; }
  }
  for (let page = 0; page < 200; page++) {
    const result = await client.players(cursor);
    const next = result.meta.next_cursor;
    if (next != null && seen.includes(next)) throw new Error('nba_cursor_repeated');
    await db.query('begin');
    try {
      const players = new Map(directory.players.map((p) => [p.id, p]));
      for (const raw of result.data) { const player = await mapPlayer(db, raw, directory.teams); players.set(player.id, player); }
      directory = { ...directory, players: [...players.values()], complete: next == null, observedAt: new Date().toISOString() };
      await saveDataset(db, `directory-raw-page-${cursor ?? 'first'}`, result);
      await saveDataset(db, 'directory', DirectorySchema.parse(directory));
      if (next != null) seen.push(next);
      await saveDataset(db, 'directory-cursor', { cursor: next ?? undefined, complete: next == null, startedAt, seen });
      await db.query('commit');
    } catch (error) { await db.query('rollback'); throw error; }
    console.info(JSON.stringify({ dataset: 'directory', players: directory.players.length, complete: directory.complete }));
    if (next == null) return { status: 'published', players: directory.players.length, teams: directory.teams.length };
    cursor = next;
  }
  throw new Error('nba_page_limit');
}
