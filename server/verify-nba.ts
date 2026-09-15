import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { databasePool } from './db.js';
import { publishSchedule } from './worker/schedule-store.js';
import { NbaGameSchema } from './worker/nba-client.js';
import { ScheduleSnapshotSchema } from '../packages/contracts/src/schedule.js';

// Replays only already imported NBA records into the verified local development DB.
const address = new URL(process.env.DATABASE_URL ?? 'http://missing');
assert.equal(address.hostname, '127.0.0.1', 'Verification requires local Supabase');
assert.equal(address.port, '54322', 'Verification requires the local development port');
const pool = databasePool()!;
const db = await pool.connect();
try {
  await db.query('select pg_advisory_lock(821901)');
  const { rows: [row] } = await db.query("select payload from arena_private.schedule_generations where competition_key='nba'");
  const before = ScheduleSnapshotSchema.parse(row?.payload);
  const counts = async () => (await db.query(`select
    (select count(*)::int from public.canonical_events where competition_key='nba') events,
    (select count(*)::int from public.provider_crosswalks) crosswalks,
    (select count(*)::int from public.ingestion_deliveries) deliveries`)).rows[0];
  const initialCounts = await counts();
  const { rows: [delivery] } = await db.query(`select payload_hash from public.ingestion_deliveries
    where adapter_version='nba-schedule-1' order by processed_at desc limit 1`);
  assert.match(delivery.payload_hash, /^[0-9a-f]{64}$/);
  const games = NbaGameSchema.array().parse(JSON.parse(await readFile(new URL(`./data/raw/${delivery.payload_hash}.json`, import.meta.url), 'utf8')));
  const replay = await publishSchedule(db, games, before.windowStart, before.windowEnd, before.observedAt);
  assert.deepEqual(await counts(), initialCounts, 'Replay created duplicate records');
  assert.deepEqual(replay.games.map((game) => game.id).sort(), before.games.map((game) => game.id).sort(), 'Replay changed canonical IDs');
  for (const role of ['anon', 'authenticated']) {
    for (const table of ['public.canonical_events', 'arena_private.schedule_generations']) {
      await db.query('begin');
      await db.query(`set local role ${role}`);
      let denied = false;
      try { await db.query(`select * from ${table} limit 1`); }
      catch (error) { denied = (error as { code: string }).code === '42501'; }
      finally { await db.query('rollback'); }
      assert.ok(denied, `${role} can read internal table ${table}`);
    }
  }
  console.info(JSON.stringify({ status: 'passed', ...initialCounts, replayStable: true, browserRolesDenied: true }));
} catch {
  console.error('NBA database verification failed; no credentials logged.');
  process.exitCode = 1;
} finally {
  await db.query('select pg_advisory_unlock(821901)').catch(() => {});
  db.release(); await pool.end();
}
