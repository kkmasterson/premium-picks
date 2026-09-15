import type { Pool } from 'pg';
import { DirectorySchema, OddsSnapshotSchema, type Directory, type OddsView } from '../../packages/contracts/src/free-data.js';
import { changes } from '../worker/odds-store.js';

export function freshness(at: string | undefined, seconds: number, now = Date.now()) {
  if (!at) return 'unavailable' as const;
  const age = now - Date.parse(at);
  return age < -30000 || age > seconds * 1000 ? 'stale' as const : 'fresh' as const;
}
export function freeDataReaders(pool: Pool | null) {
  return {
    directory: async () => {
      if (!pool) return { data: null, freshness: 'unavailable' as const };
      try {
        const row = (await pool.query("select payload from arena_private.free_datasets where key='directory'")).rows[0];
        if (!row) return { data: null, freshness: 'unavailable' as const };
        const data: Directory = DirectorySchema.parse(row.payload);
        // Free artwork is approved for this local development proof only.
        if (process.env.NODE_ENV !== 'production') {
          const enriched = new Map((await pool.query('select entity_id,payload from arena_private.entity_enrichment')).rows.map((r) => [r.entity_id, r.payload]));
          data.teams = data.teams.map((t) => ({ ...t, image: enriched.get(t.id)?.image ?? null, venue: enriched.get(t.id)?.venue ?? null }));
          data.players = data.players.map((p) => ({ ...p, image: enriched.get(p.id)?.image ?? null }));
          data.leagueImage = (await pool.query("select payload from arena_private.free_datasets where key='league-artwork'")).rows[0]?.payload.image ?? null;
        }
        return { data: DirectorySchema.parse(data), freshness: freshness(data.observedAt, 31 * 86400) };
      } catch { return { data: null, freshness: 'unavailable' as const }; }
    },
    odds: async (eventId?: string) => {
      if (!pool) return { data: null, freshness: 'unavailable' as const };
      try {
        const rows = (await pool.query(`select payload from arena_private.odds_observations where event_id=coalesce($1::uuid,(select event_id from arena_private.odds_observations order by observed_at desc limit 1)) order by observed_at desc limit 30`, [eventId ?? null])).rows;
        const history = rows.map((r) => OddsSnapshotSchema.parse(r.payload));
        if (!history.length) return { data: null, freshness: 'unavailable' as const };
        const data: OddsView = { current: history[0], history, alerts: history.flatMap((snapshot, i) => changes(history[i + 1] ?? null, snapshot)).slice(0, 100) };
        return { data, freshness: freshness(data.current!.observedAt, 15 * 60) };
      } catch { return { data: null, freshness: 'unavailable' as const }; }
    },
  };
}
