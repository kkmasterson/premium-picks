import { databasePool } from './db.js';
import { NbaClient } from './worker/nba-client.js';
import { importDirectory, repairDirectoryIdentity } from './worker/free-store.js';
import { importOdds } from './worker/odds-store.js';
import { OddsClient } from './worker/odds-client.js';
import { importArtwork } from './worker/artwork.js';
import { importRecentScores } from './worker/recent-scores.js';
import { nbaSeasonWindow } from './worker/schedule-policy.js';
import { publishSchedule } from './worker/schedule-store.js';

const pool = databasePool();
if (!pool) throw new Error('database_missing');
const db = await pool.connect();
let locked = false;
try {
  const command = process.argv[2];
  // Same lock as schedule publication protects canonical entity creation.
  if (!['odds', 'artwork'].includes(command ?? '')) {
    locked = (await db.query('select pg_try_advisory_lock(821901) as acquired')).rows[0].acquired;
    if (!locked) throw new Error('worker_busy');
  }
  if (command === 'directory') {
    console.info(await importDirectory(db, new NbaClient(process.env.BALLDONTLIE_API_KEY ?? '')));
  } else if (command === 'odds') {
    console.info(await importOdds(db, new OddsClient(process.env.THE_ODDS_API_KEY ?? ''), process.argv[3]));
  } else if (command === 'artwork') {
    console.info(await importArtwork(db));
  } else if (command === 'scores') {
    console.info(await importRecentScores(db, new NbaClient(process.env.BALLDONTLIE_API_KEY ?? '')));
  } else if (command === 'repair-identity') {
    console.info(await repairDirectoryIdentity(db));
  } else if (command === 'schedule') {
    const { start, end } = nbaSeasonWindow();
    const games = await new NbaClient(process.env.BALLDONTLIE_API_KEY ?? '').games(start, end);
    const snapshot = await publishSchedule(db, games, start, end, new Date().toISOString());
    console.info({ status: 'published', games: snapshot.games.length });
  } else throw new Error('unknown_command');
} catch (error) {
  console.error(error instanceof Error && /^[a-z_]+$/.test(error.message) ? error.message : 'free_data_operation_failed');
  process.exitCode = 1;
} finally {
  if (locked) await db.query('select pg_advisory_unlock(821901)').catch(() => {});
  db.release(); await pool.end();
}
