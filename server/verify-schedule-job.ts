import assert from 'node:assert/strict';
import { databasePool } from './db.js';
import { ScheduleResponseSchema } from '../packages/contracts/src/schedule.js';

const address = new URL(process.env.DATABASE_URL ?? 'http://missing');
assert.equal(address.hostname, '127.0.0.1');
assert.equal(address.port, '54322');
const pool = databasePool()!;
const db = await pool.connect();
try {
  const { rows: [job] } = await db.query(`select status,last_success_at,next_due_at
    from arena_private.dataset_jobs where competition_key='nba' and dataset_key='schedule'`);
  assert.equal(job.status, 'succeeded');
  assert.ok(job.last_success_at);
  assert.ok(new Date(job.next_due_at).getTime() > Date.now());
  for (const role of ['anon', 'authenticated']) {
    await db.query('begin');
    await db.query(`set local role ${role}`);
    let denied = false;
    try { await db.query('select * from arena_private.dataset_jobs limit 1'); }
    catch (error) { denied = (error as { code: string }).code === '42501'; }
    finally { await db.query('rollback'); }
    assert.ok(denied);
  }
  const response = await fetch('http://127.0.0.1:8787/api/v1/nba/schedule');
  assert.equal(response.status, 200);
  const payload = ScheduleResponseSchema.parse(await response.json());
  assert.equal(payload.meta.automaticRefresh, false);
  assert.equal(payload.meta.freshness, 'fresh');
  assert.ok(payload.data && payload.data.games.length > 1000);
  assert.ok(payload.data.windowStart.endsWith('-09-01'));
  assert.ok(payload.data.windowEnd.endsWith('-08-31'));
  assert.equal(payload.data.observedAt, new Date(job.last_success_at).toISOString());
  const cached = await fetch('http://127.0.0.1:8787/api/v1/nba/schedule', { headers: { 'If-None-Match': response.headers.get('etag')! } });
  assert.equal(cached.status, 304);
  console.info(JSON.stringify({ status: 'passed', games: payload.data.games.length, nextDueAt: job.next_due_at, privateJobAccessDenied: true, apiAndDatabaseAgree: true, etag: true }));
} catch {
  console.error('Weekly schedule verification failed; no credentials logged.');
  process.exitCode = 1;
} finally { db.release(); await pool.end(); }
