// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import type { Pool } from 'pg';
import { nbaSeasonWindow, nextScheduleCheck } from './schedule-policy';
import { importWeeklySchedule } from './weekly-schedule';

describe('weekly NBA policy', () => {
  it('uses Arizona season boundaries and Monday 04:00 checks', () => {
    expect(nbaSeasonWindow(new Date('2026-09-01T06:59:00Z'))).toEqual({ start: '2025-09-01', end: '2026-08-31' });
    expect(nbaSeasonWindow(new Date('2026-09-01T07:00:00Z'))).toEqual({ start: '2026-09-01', end: '2027-08-31' });
    expect(nextScheduleCheck(new Date('2026-09-07T10:59:00Z'))).toBe('2026-09-07T11:00:00.000Z');
    expect(nextScheduleCheck(new Date('2026-09-07T11:00:00Z'))).toBe('2026-09-14T11:00:00.000Z');
  });
  it('skips upstream after a restart when the durable job is not due', async () => {
    const query = vi.fn().mockResolvedValueOnce({ rows: [{ acquired: true }] })
      .mockResolvedValueOnce({ rows: [{ next_due_at: new Date('2026-09-14T11:00:00Z') }] }).mockResolvedValue({ rows: [] });
    const release = vi.fn();
    const pool = { connect: async () => ({ query, release }) } as unknown as Pool;
    const games = vi.fn();
    expect(await importWeeklySchedule(pool, { games }, new Date('2026-09-09T00:00:00Z'))).toEqual({ status: 'not_due', nextDueAt: '2026-09-14T11:00:00.000Z' });
    expect(games).not.toHaveBeenCalled(); expect(release).toHaveBeenCalledOnce();
  });
  it('does not call the provider while a competing worker owns the lock', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [{ acquired: false }] });
    const games = vi.fn();
    expect(await importWeeklySchedule({ connect: async () => ({ query, release: vi.fn() }) } as unknown as Pool, { games })).toEqual({ status: 'busy' });
    expect(games).not.toHaveBeenCalled();
  });
  it('reserves the next check before I/O and records safe errors on failed imports', async () => {
    const query = vi.fn().mockResolvedValueOnce({ rows: [{ acquired: true }] }).mockResolvedValue({ rows: [] });
    const games = vi.fn().mockImplementation(async (start, end) => {
      expect(start).toBe('2026-09-01'); expect(end).toBe('2027-08-31');
      expect(query.mock.calls[2][0]).toContain('insert into arena_private.dataset_jobs');
      throw new Error('secret-provider-url');
    });
    await expect(importWeeklySchedule({ connect: async () => ({ query, release: vi.fn() }) } as unknown as Pool, { games }, new Date('2026-09-09T00:00:00Z'))).rejects.toThrow('database_unavailable');
    expect(query.mock.calls[3][1]).toEqual(['database_unavailable']);
    expect(query.mock.calls.at(-1)?.[0]).toContain('pg_advisory_unlock');
  });
});
