import { act, renderHook } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { useLiveSchedule } from './live-schedule';
import { scheduleResponse } from '../../../server/api/schedule';

afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });
it('reads only on mount and manual reload, retains saved data on failure, and ages without polling', async () => {
  vi.useFakeTimers();
  const snapshot = { games: [], windowStart: '2026-09-01', windowEnd: '2027-08-31', observedAt: new Date().toISOString(), generation: 'f4d0c210-1111-4111-8111-111111111111' };
  const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => scheduleResponse(snapshot) });
  vi.stubGlobal('fetch', fetcher);
  const { result, unmount } = renderHook(() => useLiveSchedule());
  await act(async () => {});
  expect(result.current.loading).toBe(false);
  expect(result.current.freshness).toBe('fresh');
  await act(async () => { vi.advanceTimersByTime(60 * 60 * 1000); });
  expect(fetcher).toHaveBeenCalledTimes(1);
  await act(async () => { vi.advanceTimersByTime(8 * 86_400_000); });
  expect(result.current.freshness).toBe('stale');
  expect(fetcher).toHaveBeenCalledTimes(1);
  fetcher.mockRejectedValueOnce(new Error('offline'));
  await act(async () => { result.current.retry(); });
  expect(fetcher).toHaveBeenCalledTimes(2);
  expect(result.current.snapshot).toEqual(snapshot);
  expect(result.current.freshness).toBe('stale');
  unmount();
});
