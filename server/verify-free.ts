import assert from 'node:assert/strict';
import { databasePool } from './db.js';
import { freeDataReaders } from './api/free-data.js';
import { DirectoryResponseSchema, OddsResponseSchema } from '../packages/contracts/src/free-data.js';
import { ScheduleSnapshotSchema } from '../packages/contracts/src/schedule.js';
import { buildApi } from './api/app.js';
import { importOdds } from './worker/odds-store.js';
import { OddsClient } from './worker/odds-client.js';

const address = new URL(process.env.DATABASE_URL ?? 'http://missing');
assert.ok(['localhost', '127.0.0.1'].includes(address.hostname), 'local_database_required');
const pool = databasePool()!;
const db = await pool.connect();
const readers = freeDataReaders(pool);
const app = await buildApi({ freeData: readers });
try {
  const directory = DirectoryResponseSchema.parse((await app.inject('/api/v1/nba/directory')).json());
  assert.ok(directory.data?.complete);
  assert.equal(new Set(directory.data.teams.map((t) => t.id)).size, directory.data.teams.length);
  assert.equal(new Set(directory.data.players.map((p) => p.id)).size, directory.data.players.length);
  assert.ok(directory.data.players.every((p) => p.teamId === null || directory.data!.teams.some((t) => t.id === p.teamId)));
  const odds = OddsResponseSchema.parse((await app.inject('/api/v1/nba/odds')).json());
  assert.ok(odds.data?.current);
  const schedule = ScheduleSnapshotSchema.parse((await db.query("select payload from arena_private.schedule_generations where competition_key='nba'")).rows[0]?.payload);
  assert.ok(schedule.games.some((g) => g.id === odds.data!.current!.eventId));
  // A restarted collector must not spend credits during the persisted cooldown.
  const before = (await db.query('select sum(reserved)::int as reserved from arena_private.odds_budget')).rows[0].reserved;
  let requests = 0;
  const guard = new OddsClient('test-only', async () => { requests++; throw new Error('unexpected_network'); });
  const guarded = await importOdds(db, guard);
  assert.ok(['cooldown', 'budget_exhausted'].includes(guarded.status));
  assert.equal(requests, 0);
  assert.equal((await db.query('select sum(reserved)::int as reserved from arena_private.odds_budget')).rows[0].reserved, before);
  for (const role of ['anon', 'authenticated']) for (const table of ['free_datasets', 'odds_observations', 'odds_budget', 'entity_enrichment']) {
    await db.query('begin');
    await db.query(`set local role ${role}`);
    let denied = false;
    try { await db.query(`select * from arena_private.${table} limit 1`); }
    catch (error) { denied = (error as { code: string }).code === '42501'; }
    finally { await db.query('rollback'); }
    assert.ok(denied, `${role} can read ${table}`);
  }
  console.info(JSON.stringify({ status: 'passed', teams: directory.data.teams.length, players: directory.data.players.length, teamImages: directory.data.teams.filter((t) => t.image).length, playerImages: directory.data.players.filter((p) => p.image).length, leagueImage: Boolean(directory.data.leagueImage), games: schedule.games.length, quotes: odds.data.current.quotes.length, books: new Set(odds.data.current.quotes.map((q) => q.book)).size, props: new Set(odds.data.current.quotes.filter((q) => q.subject !== 'Game').map((q) => q.subject)).size, creditsRemaining: odds.data.current.creditsRemaining, restartBudgetGuard: true, browserRolesDenied: true }));
} catch { console.error('free_data_verification_failed'); process.exitCode = 1; }
finally { await app.close(); db.release(); await pool.end(); }
