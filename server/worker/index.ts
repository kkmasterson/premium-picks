import { setTimeout as pause } from 'node:timers/promises';
import { databasePool } from '../db.js';
import { NbaClient } from './nba-client.js';
import { importWeeklySchedule } from './weekly-schedule.js';
import { importFreeCycle } from './free-cycle.js';

const pool = databasePool();
const key = process.env.BALLDONTLIE_API_KEY?.trim();
if (!pool || !key) {
  console.error('NBA worker requires DATABASE_URL and BALLDONTLIE_API_KEY. Run npm run check:env.');
  await pool?.end(); process.exitCode = 1;
} else {
  const client = new NbaClient(key);
  let stopping = false;
  const shutdown = new AbortController();
  const stop = () => { stopping = true; shutdown.abort(); };
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
  do {
    try {
      const result = await importWeeklySchedule(pool, client);
      console.info(JSON.stringify({ service: 'nba-worker', ...result }));
    } catch (error) {
      const code = error instanceof Error && /^nba_[a-z0-9_]+$/.test(error.message) ? error.message : 'database_unavailable';
      console.error(JSON.stringify({ service: 'nba-worker', status: 'failed', code }));
      if (process.argv.includes('--once')) process.exitCode = 1;
    }
    if (!stopping) console.info(JSON.stringify({ service: 'free-data-worker', datasets: await importFreeCycle(pool, client) }));
    if (process.argv.includes('--once') || stopping) break;
    // This checks only persisted job eligibility. Providers run once when due.
    await pause(60_000, undefined, { signal: shutdown.signal }).catch(() => {});
  } while (!stopping);
  await pool.end();
}
