// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Pool } from 'pg';
import { scheduleReader, scheduleResponse } from './schedule';
import { buildApi } from './app';
import type { ScheduleSnapshot } from '../../packages/contracts/src/schedule';

const snapshot: ScheduleSnapshot = { games: [], windowStart: '2026-09-01', windowEnd: '2026-10-09', observedAt: '2026-09-09T00:00:00.000Z', generation: 'f4d0c210-1111-4111-8111-111111111111' };
afterEach(() => vi.useRealTimers());
describe('stored schedule API', () => {
  it('separates empty successful schedules from unavailable and stale data', () => {
    const now = Date.parse(snapshot.observedAt);
    expect(scheduleResponse(snapshot, now).meta.freshness).toBe('fresh');
    expect(scheduleResponse(snapshot, now + 7 * 86_400_000).meta.freshness).toBe('fresh');
    expect(scheduleResponse(snapshot, now).meta.automaticRefresh).toBe(false);
    expect(scheduleResponse(snapshot, now + 8 * 86_400_000 + 1).meta.freshness).toBe('stale');
    expect(scheduleResponse(snapshot, now, true).meta.freshness).toBe('stale');
    expect(scheduleResponse(null).meta.freshness).toBe('unavailable');
  });
  it('coalesces reads and retains stale data on DB failure', async () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date(snapshot.observedAt));
    const query = vi.fn().mockResolvedValue({ rows: [{ payload: snapshot }] });
    const read = scheduleReader({ query } as unknown as Pool);
    const responses = await Promise.all(Array.from({ length: 100 }, () => read()));
    expect(query).toHaveBeenCalledTimes(1);
    expect(responses.every((value) => value.meta.freshness === 'fresh')).toBe(true);
    vi.advanceTimersByTime(10_001); query.mockRejectedValueOnce(new Error('connection secret'));
    const result = await read();
    expect(result.data).toEqual(snapshot); expect(result.meta.freshness).toBe('stale');
    expect(JSON.stringify(result)).not.toContain('secret');
  });
  it('shows retained data as stale after a newer provider import failed', async () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date(snapshot.observedAt));
    const query = vi.fn().mockResolvedValue({ rows: [{ payload: snapshot, import_failed: true }] });
    const result = await scheduleReader({ query } as unknown as Pool)();
    expect(result.data).toEqual(snapshot);
    expect(result.meta.freshness).toBe('stale');
  });
  it('changes ETags when freshness changes', async () => {
    let now = Date.parse(snapshot.observedAt);
    const app = await buildApi({ readSchedule: async () => scheduleResponse(snapshot, now) });
    try {
      const first = await app.inject('/api/v1/nba/schedule');
      const next = await app.inject({ url: '/api/v1/nba/schedule', headers: { 'if-none-match': first.headers.etag! } });
      expect(next.statusCode).toBe(304);
      now += 8 * 86_400_000 + 1;
      const stale = await app.inject({ url: '/api/v1/nba/schedule', headers: { 'if-none-match': first.headers.etag! } });
      expect(stale.statusCode).toBe(200); expect(stale.json().meta.freshness).toBe('stale');
      expect(stale.json().meta.capabilities.playerStats).toBe(false);
    } finally { await app.close(); }
  });
});
