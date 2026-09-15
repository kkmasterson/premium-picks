import type { PoolClient } from 'pg';
import { ScheduleSnapshotSchema } from '../../packages/contracts/src/schedule.js';
import { NbaClient } from './nba-client.js';
import { publishSchedule } from './schedule-store.js';
import { loadDataset, saveDataset } from './free-store.js';

export async function importRecentScores(db: PoolClient, client: NbaClient) {
  const prior = ScheduleSnapshotSchema.parse((await db.query("select payload from arena_private.schedule_generations where competition_key='nba'")).rows[0]?.payload);
  const now = new Date();
  const checkpoint = await loadDataset(db, 'scores-next') as { at: string } | null;
  if (checkpoint && Date.parse(checkpoint.at) > now.getTime()) return { status: 'not_due' };
  const active = prior.games.some((g) => g.startsAt && Math.abs(Date.parse(g.startsAt) - now.getTime()) < 6 * 3600000);
  await saveDataset(db, 'scores-next', { at: new Date(now.getTime() + (active ? 5 * 60000 : 24 * 3600000)).toISOString() });
  const start = new Date(now.getTime() - 86400000).toISOString().slice(0, 10);
  const end = new Date(now.getTime() + 86400000).toISOString().slice(0, 10);
  const raw = await client.games(start, end);
  // Publish updates and the merged season in a single transaction; per-game
  // observedAt distinguishes current scores from the weekly calendar import.
  const result = await publishSchedule(db, raw, start, end, new Date().toISOString(), prior);
  return { status: 'published', updated: raw.length, games: result.games.length };
}
