import { z } from 'zod';
import type { Quote } from '../../packages/contracts/src/free-data.js';

export const MARKET_LABELS: Record<string, string> = {
  h2h: 'Moneyline', spreads: 'Spread', totals: 'Total', player_points: 'Points', player_rebounds: 'Rebounds', player_assists: 'Assists', player_threes: 'Threes', player_points_rebounds_assists: 'Points + rebounds + assists', player_points_rebounds: 'Points + rebounds', player_points_assists: 'Points + assists', player_rebounds_assists: 'Rebounds + assists', alternate_spreads: 'Alternate spread', alternate_totals: 'Alternate total', player_points_alternate: 'Alternate points', player_rebounds_alternate: 'Alternate rebounds', player_assists_alternate: 'Alternate assists', player_threes_alternate: 'Alternate threes',
};
export const OddsEventSchema = z.object({ id: z.string().regex(/^[a-zA-Z0-9_-]+$/), sport_key: z.literal('basketball_nba'), home_team: z.string(), away_team: z.string(), commence_time: z.string().datetime({ offset: true }) });
export const EventOddsSchema = OddsEventSchema.extend({ bookmakers: z.array(z.object({ key: z.string(), title: z.string(), markets: z.array(z.object({ key: z.string(), last_update: z.string().datetime({ offset: true }), outcomes: z.array(z.object({ name: z.string(), description: z.string().optional(), point: z.number().optional(), price: z.number().gt(1) })) })) })) });
export type OddsEvent = z.infer<typeof OddsEventSchema>;
export function selectedMarkets(raw = 'h2h,spreads,totals,player_points') {
  const markets = [...new Set(raw.split(',').map((s) => s.trim()))];
  if (!markets.length || markets.length > 6 || markets.some((key) => !MARKET_LABELS[key])) throw new Error('odds_invalid_markets');
  return markets;
}
export class OddsClient {
  private key: string;
  private fetcher: typeof fetch;
  constructor(key: string, fetcher = fetch) { this.key = key; this.fetcher = fetcher; }
  private async request(path: string, params: Record<string, string> = {}) {
    if (!this.key.trim()) throw new Error('odds_key_missing');
    const url = new URL(`https://api.the-odds-api.com/v4/sports/basketball_nba/${path}`);
    url.searchParams.set('apiKey', this.key);
    for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
    let response: Response;
    try { response = await this.fetcher(url, { signal: AbortSignal.timeout(15000), redirect: 'error' }); }
    catch { throw new Error('odds_network_error'); }
    if (!response.ok) throw new Error(`odds_http_${response.status}`);
    const remainingHeader = response.headers.get('x-requests-remaining');
    const remaining = remainingHeader !== null && /^\d+$/.test(remainingHeader) ? Number(remainingHeader) : null;
    try { return { raw: await response.json(), remaining }; } catch { throw new Error('odds_schema_mismatch'); }
  }
  async events() { const result = await this.request('events'); return { events: OddsEventSchema.array().parse(result.raw), remaining: result.remaining }; }
  async odds(id: string, markets: string[]) {
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) throw new Error('odds_invalid_event');
    selectedMarkets(markets.join(','));
    const result = await this.request(`events/${id}/odds`, { regions: 'us', markets: markets.join(','), oddsFormat: 'decimal' });
    return { event: EventOddsSchema.parse(result.raw), remaining: result.remaining };
  }
}

export function comparableKey(quote: Pick<Quote, 'market' | 'subject' | 'side' | 'line'>) { return JSON.stringify([quote.market, quote.subject, quote.side, quote.line]); }
/** De-vig only complete, opposing two-way outcomes at the SAME line and book. */
export function calculateQuotes(event: z.infer<typeof EventOddsSchema>, now = Date.now()): Quote[] {
  const quotes: Quote[] = [];
  for (const book of event.bookmakers) for (const market of book.markets) {
    if (!MARKET_LABELS[market.key]) continue;
    for (const outcome of market.outcomes) {
      const isSpread = market.key.includes('spreads');
      const opponents = market.outcomes.filter((other) => (other.description ?? '') === (outcome.description ?? '') &&
        (isSpread ? other.point === -(outcome.point ?? NaN) && other.name !== outcome.name : other.point === outcome.point && other.name !== outcome.name));
      const opponent = opponents.length === 1 ? opponents[0] : undefined;
      const validPair = opponent && (market.key === 'h2h' || isSpread ? new Set([outcome.name, opponent.name]).has(event.home_team) && new Set([outcome.name, opponent.name]).has(event.away_team) : new Set([outcome.name, opponent.name]).has('Over') && new Set([outcome.name, opponent.name]).has('Under'));
      const implied = 1 / outcome.price;
      const twoWay = market.key !== 'h2h' || market.outcomes.length === 2;
      quotes.push({ book: book.title, market: MARKET_LABELS[market.key], subject: outcome.description ?? 'Game', side: outcome.name, line: outcome.point ?? null, decimal: outcome.price, updatedAt: market.last_update, implied, noVig: validPair && twoWay ? implied / (implied + 1 / opponent.price) : null, best: false, consensus: null, disagreement: null });
    }
  }
  const groups = new Map<string, Quote[]>();
  for (const quote of quotes) { const key = comparableKey(quote); groups.set(key, [...(groups.get(key) ?? []), quote]); }
  for (const group of groups.values()) {
    const recent = group.filter((q) => now - Date.parse(q.updatedAt) <= 900000 && now - Date.parse(q.updatedAt) >= -30000);
    const best = Math.max(...recent.map((q) => q.decimal));
    const probabilities = recent.flatMap((q) => q.noVig === null ? [] : [q.noVig]);
    for (const quote of group) {
      quote.best = recent.includes(quote) && new Set(recent.map((q) => q.book)).size > 1 && quote.decimal === best;
      quote.consensus = recent.includes(quote) && probabilities.length > 1 ? probabilities.reduce((a, b) => a + b, 0) / probabilities.length : null;
      quote.disagreement = recent.includes(quote) && probabilities.length > 1 ? Math.max(...probabilities) - Math.min(...probabilities) : null;
    }
  }
  return quotes;
}
