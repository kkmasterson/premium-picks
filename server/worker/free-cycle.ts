import type { Pool } from 'pg';
import { NbaClient } from './nba-client.js';
import { importDirectory } from './free-store.js';
import { importArtwork } from './artwork.js';
import { importRecentScores } from './recent-scores.js';
import { importOdds } from './odds-store.js';
import { OddsClient } from './odds-client.js';

export async function importFreeCycle(pool: Pool, nba: NbaClient) {
  const db = await pool.connect();
  let locked = false;
  const results: Record<string, unknown> = {};
  const run = async (key: string, operation: () => Promise<unknown>) => {
    try { results[key] = await operation(); }
    catch (error) { results[key] = { status: 'failed', code: error instanceof Error && /^[a-z_0-9]+$/.test(error.message) ? error.message : 'free_data_operation_failed' }; }
  };
  try {
    locked = (await db.query('select pg_try_advisory_lock(821901) as acquired')).rows[0].acquired;
    if (locked) {
      await run('scores', () => importRecentScores(db, nba));
      await run('directory', () => importDirectory(db, nba));
      await db.query('select pg_advisory_unlock(821901)'); locked = false;
    }
    await run('artwork', () => importArtwork(db));
    if (process.env.THE_ODDS_API_KEY?.trim()) await run('odds', () => importOdds(db, new OddsClient(process.env.THE_ODDS_API_KEY!), process.env.ARENA_ODDS_EVENT_ID || undefined));
    return results;
  } finally {
    if (locked) await db.query('select pg_advisory_unlock(821901)').catch(() => {});
    db.release();
  }
}
