import { createHash, randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import type { PoolClient } from 'pg';
import { ScheduleSnapshotSchema, type ScheduleGame, type ScheduleSnapshot } from '../../packages/contracts/src/schedule.js';
import { gameState, type NbaGame } from './nba-client.js';

export async function publishSchedule(db: PoolClient, games: NbaGame[], start: string, end: string, observedAt: string, prior?: ScheduleSnapshot) {
  const payload = JSON.stringify(games);
  const hash = createHash('sha256').update(payload).digest('hex');
  const root = new URL('../data/raw/', import.meta.url);
  await mkdir(root, { recursive: true });
  await writeFile(new URL(`${hash}.json`, root), payload, { mode: 0o600 });
  const deliveryId = `nba-schedule-1:${hash}`;
  await db.query('begin');
  try {
    const { rows: [provider] } = await db.query<{ id: string }>("select id from public.providers where key = 'balldontlie'");
    if (!provider) throw new Error('nba_provider_not_migrated');
    await db.query(`insert into public.ingestion_deliveries
      (id,provider_id,adapter_version,payload_hash,archive_key,observed_at,status)
      values ($1,$2,'nba-schedule-1',$3,$4,$5,'received') on conflict (id) do nothing`,
    [deliveryId, provider.id, hash, `local:nba/${hash}.json`, observedAt]);
    const resolve = async (kind: 'team' | 'event', providerId: number, create: () => Promise<string>) => {
      const { rows: [mapping] } = await db.query<{ canonical_entity_id: string }>(
        'select canonical_entity_id from public.provider_crosswalks where provider_id=$1 and entity_type=$2 and provider_entity_id=$3', [provider.id, kind, String(providerId)]);
      if (mapping) return mapping.canonical_entity_id;
      const id = await create();
      await db.query(`insert into public.provider_crosswalks (provider_id,entity_type,provider_entity_id,canonical_entity_id,mapping_version,verified_at)
        values ($1,$2,$3,$4,'nba-schedule-1',now())`, [provider.id, kind, String(providerId), id]);
      return id;
    };
    const teams = new Map<number, ScheduleGame['home']>();
    for (const game of games) for (const team of [game.home_team, game.visitor_team]) {
      if (teams.has(team.id)) continue;
      const id = await resolve('team', team.id, async () => {
        const { rows: [row] } = await db.query<{ id: string }>(`insert into public.canonical_teams (sport_key,name,abbreviation)
          values ('basketball',$1,$2) returning id`, [team.full_name, team.abbreviation]);
        return row.id;
      });
      await db.query('update public.canonical_teams set name=$2,abbreviation=$3 where id=$1', [id, team.full_name, team.abbreviation]);
      teams.set(team.id, { id, name: team.full_name, abbreviation: team.abbreviation });
    }
    const mapped: ScheduleGame[] = [];
    for (const game of games) {
      const home = teams.get(game.home_team.id)!; const away = teams.get(game.visitor_team.id)!;
      const state = gameState(game);
      const id = await resolve('event', game.id, async () => {
        const { rows: [row] } = await db.query<{ id: string }>(`insert into public.canonical_events (competition_key,home_team_id,away_team_id,starts_at)
          values ('nba',$1,$2,$3) returning id`, [home.id, away.id, game.datetime ?? null]);
        return row.id;
      });
      const scoreVisible = state === 'in_progress' || state === 'final' || state === 'suspended';
      const row: ScheduleGame = {
        id, competition: 'nba', date: game.date.slice(0, 10), startsAt: game.datetime ?? null, state, home, away,
        homeScore: scoreVisible ? game.home_team_score : null, awayScore: scoreVisible ? game.visitor_team_score : null,
        period: game.period, clock: game.time?.trim() || null,
        postseason: game.postseason ?? null, observedAt,
      };
      await db.query(`update public.canonical_events set home_team_id=$2,away_team_id=$3,starts_at=$4,game_date=$5,
        lifecycle_state=$6,home_score=$7,away_score=$8,phase=$9,status_label=$10,last_delivery_id=$11,last_observed_at=$12 where id=$1`,
      [id, home.id, away.id, row.startsAt, row.date, state, row.homeScore, row.awayScore,
        state === 'in_progress' ? 'live' : state === 'final' ? 'final' : 'pregame', game.status, deliveryId, observedAt]);
      mapped.push(row);
    }
    const merged = prior ? [...new Map([...prior.games, ...mapped].map((g) => [g.id, g])).values()] : mapped;
    const snapshot = ScheduleSnapshotSchema.parse({ games: merged, windowStart: prior?.windowStart ?? start, windowEnd: prior?.windowEnd ?? end, observedAt: prior?.observedAt ?? observedAt, generation: randomUUID() });
    await db.query(`insert into arena_private.schedule_generations (competition_key,payload) values ('nba',$1)
      on conflict (competition_key) do update set payload=excluded.payload,published_at=now()`, [JSON.stringify(snapshot)]);
    await db.query("update public.ingestion_deliveries set status='published',processed_at=now() where id=$1", [deliveryId]);
    await db.query('commit');
    return snapshot;
  } catch {
    await db.query('rollback');
    throw new Error('nba_publication_failed');
  }
}
