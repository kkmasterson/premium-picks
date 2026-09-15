import type { Pool } from 'pg';
import { SCHEDULE_IMPORT_SECONDS, SCHEDULE_STALE_SECONDS, ScheduleSnapshotSchema, type ScheduleSnapshot, type ScheduleResponse } from '../../packages/contracts/src/schedule.js';

export function scheduleResponse(data: ScheduleSnapshot | null, now = Date.now(), failed = false): ScheduleResponse {
  const age = data ? now - Date.parse(data.observedAt) : Infinity;
  return { data, meta: { source: 'arena-ingestion', freshness: !data ? 'unavailable' : failed || age > SCHEDULE_STALE_SECONDS * 1000 || age < -30_000 ? 'stale' : 'fresh', importIntervalSeconds: SCHEDULE_IMPORT_SECONDS, staleAfterSeconds: SCHEDULE_STALE_SECONDS, automaticRefresh: false, capabilities: { playerStats: false, playerProps: false } } };
}

export function scheduleReader(pool: Pool | null) {
  let value: ScheduleSnapshot | null = null;
  let expires = 0; let failed = false;
  let pending: Promise<void> | null = null;
  return async () => {
    if (!pool) return scheduleResponse(null);
    if (Date.now() >= expires && !pending) {
      pending = (async () => {
        try {
          const { rows: [row] } = await pool.query<{ payload: unknown; import_failed?: boolean }>(`select g.payload,
            (j.status='failed' and j.last_attempt_at > (g.payload->>'observedAt')::timestamptz) as import_failed
            from arena_private.schedule_generations g left join arena_private.dataset_jobs j
              on j.competition_key=g.competition_key and j.dataset_key='schedule'
            where g.competition_key='nba'`);
          value = row ? ScheduleSnapshotSchema.parse(row.payload) : null;
          failed = row?.import_failed === true;
        } catch { failed = true; }
        finally { expires = Date.now() + 10_000; }
      })();
    }
    if (pending) { await pending; pending = null; }
    return scheduleResponse(value, Date.now(), failed);
  };
}
