import type { Pool } from 'pg';
import { NbaClient } from './nba-client.js';
import { publishSchedule } from './schedule-store.js';
import { nbaSeasonWindow, nextScheduleCheck } from './schedule-policy.js';

export async function importWeeklySchedule(pool: Pool, client: Pick<NbaClient, 'games'>, now = new Date()) {
  const connection = await pool.connect();
  let locked = false;
  try {
    const { rows: [lock] } = await connection.query<{ acquired: boolean }>('select pg_try_advisory_lock(821901) as acquired');
    locked = lock.acquired;
    if (!locked) return { status: 'busy' as const };
    const { rows: [job] } = await connection.query<{ next_due_at: Date }>(
      "select next_due_at from arena_private.dataset_jobs where competition_key='nba' and dataset_key='schedule'");
    if (job && new Date(job.next_due_at).getTime() > now.getTime()) {
      return { status: 'not_due' as const, nextDueAt: new Date(job.next_due_at).toISOString() };
    }
    const nextDueAt = nextScheduleCheck(now);
    // Reserve the attempt durably before upstream I/O. A crash/restart cannot
    // repeatedly spend the provider allowance. Failures retain the saved feed.
    await connection.query(`insert into arena_private.dataset_jobs
      (competition_key,dataset_key,last_attempt_at,next_due_at,status)
      values ('nba','schedule',$1,$2,'running') on conflict (competition_key,dataset_key)
      do update set last_attempt_at=$1,next_due_at=$2,status='running',error_code=null`, [now.toISOString(), nextDueAt]);
    try {
      const { start, end } = nbaSeasonWindow(now);
      const games = await client.games(start, end);
      const snapshot = await publishSchedule(connection, games, start, end, now.toISOString());
      await connection.query(`update arena_private.dataset_jobs set status='succeeded',last_success_at=$1,error_code=null
        where competition_key='nba' and dataset_key='schedule'`, [snapshot.observedAt]);
      return { status: 'published' as const, games: games.length, observedAt: snapshot.observedAt, windowStart: start, windowEnd: end, nextDueAt };
    } catch (error) {
      const code = error instanceof Error && /^nba_[a-z0-9_]+$/.test(error.message) ? error.message : 'database_unavailable';
      await connection.query(`update arena_private.dataset_jobs set status='failed',error_code=$1
        where competition_key='nba' and dataset_key='schedule'`, [code]).catch(() => {});
      throw new Error(code);
    }
  } finally {
    if (locked) await connection.query('select pg_advisory_unlock(821901)').catch(() => {});
    connection.release();
  }
}
