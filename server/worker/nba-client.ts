import { z } from 'zod';
import { GameStateSchema } from '../../packages/contracts/src/schedule.js';

export const NbaTeamSchema = z.object({ id: z.number().int().positive(), full_name: z.string().min(1), abbreviation: z.string().min(1), city: z.string().optional(), conference: z.string().optional(), division: z.string().optional() });
const team = NbaTeamSchema;
export const NbaPlayerSchema = z.object({ id: z.number().int().positive(), first_name: z.string(), last_name: z.string(), position: z.string(), height: z.string().nullish(), weight: z.string().nullish(), college: z.string().nullish(), country: z.string().nullish(), draft_year: z.number().int().nullish(), team: team.nullable() });
export const NbaGameSchema = z.object({
  id: z.number().int().positive(), date: z.string().regex(/^\d{4}-\d{2}-\d{2}/),
  datetime: z.string().datetime({ offset: true }).nullish(), status: z.string(),
  status_state: GameStateSchema.optional(), postponed: z.boolean().optional(),
  postseason: z.boolean().optional(),
  home_team: team, visitor_team: team, home_team_score: z.number().int().nonnegative().nullable(),
  visitor_team_score: z.number().int().nonnegative().nullable(), period: z.number().int().nonnegative(), time: z.string().nullish(),
});
export type NbaGame = z.infer<typeof NbaGameSchema>;
const page = z.object({ data: z.array(NbaGameSchema), meta: z.object({ next_cursor: z.number().int().nullable().optional() }) });

export function gameState(game: NbaGame) {
  if (game.postponed) return 'postponed' as const;
  if (game.status_state) return game.status_state;
  if (/^final/i.test(game.status)) return 'final' as const;
  if (/postponed/i.test(game.status)) return 'postponed' as const;
  if (/cancel/i.test(game.status)) return 'canceled' as const;
  if (/suspend/i.test(game.status)) return 'suspended' as const;
  if (/delay/i.test(game.status)) return 'delayed' as const;
  if (game.period > 0) return 'in_progress' as const;
  return game.datetime ? 'scheduled' as const : 'unknown' as const;
}

export class NbaClient {
  private lastRequest = 0;
  private readonly key: string;
  private readonly fetcher: typeof fetch;
  private readonly spacingMs: number;
  constructor(key: string, fetcher = fetch, spacingMs = 16_000) {
    this.key = key; this.fetcher = fetcher; this.spacingMs = spacingMs;
  }
  private async directoryRequest(path: string) {
    if (!this.key.trim()) throw new Error('nba_key_missing');
    const delay = this.spacingMs - (Date.now() - this.lastRequest);
    if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
    this.lastRequest = Date.now();
    let response: Response;
    try { response = await this.fetcher(new URL(path, 'https://api.balldontlie.io/v1/'), { headers: { Authorization: this.key }, signal: AbortSignal.timeout(15000), redirect: 'error' }); }
    catch { throw new Error('nba_network_error'); }
    if (!response.ok) throw new Error(`nba_http_${response.status}`);
    try { return await response.json(); } catch { throw new Error('nba_schema_mismatch'); }
  }
  async teams() {
    return z.object({ data: z.array(NbaTeamSchema) }).parse(await this.directoryRequest('teams')).data;
  }
  async players(cursor?: number) {
    return z.object({ data: z.array(NbaPlayerSchema), meta: z.object({ next_cursor: z.number().int().nullable().optional() }) }).parse(await this.directoryRequest(`players?per_page=100${cursor === undefined ? '' : `&cursor=${cursor}`}`));
  }
  async games(start: string, end: string): Promise<NbaGame[]> {
    if (!this.key.trim()) throw new Error('nba_key_missing');
    const games = new Map<number, NbaGame>();
    // Default endpoint excludes preseason, so fetch it explicitly as well.
    for (const seasonType of [undefined, 'preseason']) {
      let cursor: number | undefined;
      const cursors = new Set<number>();
      let complete = false;
      for (let i = 0; i < 20; i++) {
        const delay = this.spacingMs - (Date.now() - this.lastRequest);
        if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
        const url = new URL('https://api.balldontlie.io/v1/games');
        url.searchParams.set('start_date', start); url.searchParams.set('end_date', end);
        url.searchParams.set('per_page', '100');
        if (seasonType) url.searchParams.set('season_type', seasonType);
        if (cursor !== undefined) url.searchParams.set('cursor', String(cursor));
        this.lastRequest = Date.now();
        let response: Response;
        try {
          response = await this.fetcher(url, { headers: { Authorization: this.key, Accept: 'application/json' }, signal: AbortSignal.timeout(15_000), redirect: 'error' });
        } catch { throw new Error('nba_network_error'); }
        if (!response.ok) throw new Error(`nba_http_${response.status}`);
        let result: z.infer<typeof page>;
        try { result = page.parse(await response.json()); } catch { throw new Error('nba_schema_mismatch'); }
        for (const game of result.data) games.set(game.id, game);
        const next = result.meta.next_cursor;
        if (next == null) { complete = true; break; }
        if (cursors.has(next)) throw new Error('nba_cursor_repeated');
        cursors.add(next); cursor = next;
      }
      if (!complete) throw new Error('nba_page_limit');
    }
    return [...games.values()];
  }
}
