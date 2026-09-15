import { useEffect, useState } from 'react';
import { SCHEDULE_STALE_SECONDS, ScheduleResponseSchema, type ScheduleResponse } from '@arena/contracts';

export function useLiveSchedule(enabled = true) {
  const [payload, setPayload] = useState<ScheduleResponse | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!enabled) return;
    let disposed = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    async function refresh() {
      try {
        const response = await fetch('/api/v1/nba/schedule', { signal: controller.signal, cache: 'no-cache' });
        if (!response.ok) throw new Error('schedule_unavailable');
        const next = ScheduleResponseSchema.parse(await response.json());
        if (!disposed) { setPayload(next); setFailed(false); }
      } catch { if (!disposed) setFailed(true); }
      finally {
        clearTimeout(timeout);
        if (!disposed) { setLoading(false); setNow(Date.now()); }
      }
    }
    void refresh();
    return () => { disposed = true; clearTimeout(timeout); controller.abort(); };
  }, [retry, enabled]);
  useEffect(() => {
    if (!payload?.data) return;
    const expires = Date.parse(payload.data.observedAt) + SCHEDULE_STALE_SECONDS * 1000;
    // Update age without a network request, even if the tab remains open a week.
    const timer = setTimeout(() => setNow(Date.now()), Math.max(0, expires - Date.now() + 1));
    return () => clearTimeout(timer);
  }, [payload]);
  const age = payload?.data ? now - Date.parse(payload.data.observedAt) : Infinity;
  const freshness = !payload?.data ? 'unavailable' : failed || age > SCHEDULE_STALE_SECONDS * 1000 || age < -30_000 || payload.meta.freshness !== 'fresh' ? 'stale' : 'fresh';
  return { snapshot: payload?.data ?? null, freshness, loading: enabled && loading, retry: () => { setLoading(true); setRetry((n) => n + 1); } };
}
