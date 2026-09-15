import { useEffect, useState } from 'react';
import { DirectoryResponseSchema, OddsResponseSchema } from '../../../packages/contracts/src/free-data';
import type { z } from 'zod';

function usePreparedData<T>(url: string, schema: z.ZodType<T>) {
  const [state, setState] = useState<{ url: string; value: T | null; loading: boolean }>({ url, value: null, loading: true });
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal }).then(async (r) => {
      if (!r.ok) throw new Error('unavailable');
      return schema.parse(await r.json());
    }).then((value) => { if (!controller.signal.aborted) setState({ url, value, loading: false }); }).catch(() => {
      if (!controller.signal.aborted) setState({ url, value: null, loading: false });
    });
    return () => controller.abort();
  }, [url, schema, revision]);
  return { value: state.url === url ? state.value : null, loading: state.url !== url || state.loading, retry: () => { setState({ url, value: null, loading: true }); setRevision((n) => n + 1); } };
}
export const useDirectory = () => usePreparedData('/api/v1/nba/directory', DirectoryResponseSchema);
export const useOdds = (eventId?: string) => usePreparedData(`/api/v1/nba/odds${eventId ? `?eventId=${encodeURIComponent(eventId)}` : ''}`, OddsResponseSchema);
