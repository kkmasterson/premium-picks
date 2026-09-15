import { expect, it, vi } from 'vitest';
import type { PoolClient } from 'pg';
import { calculateQuotes, EventOddsSchema, OddsClient, selectedMarkets } from './odds-client';
import { changes, importOdds, matchEvent } from './odds-store';
import { artworkUrl, matchArtworkTeam } from './artwork';
import { freshness } from '../api/free-data';
import type { OddsSnapshot } from '../../packages/contracts/src/free-data';
import type { ScheduleGame } from '../../packages/contracts/src/schedule';

const at = '2026-09-11T22:00:00Z';
const now = Date.parse(at);
const event = { id: 'event1', sport_key: 'basketball_nba' as const, home_team: 'Boston Celtics', away_team: 'New York Knicks', commence_time: '2026-10-22T00:00:00Z' };
const outcomes = (line = 20.5, over = 2, under = 2) => [{ name: 'Over', description: 'Test Player', point: line, price: over }, { name: 'Under', description: 'Test Player', point: line, price: under }];
const book = (title: string, line = 20.5, over = 2, under = 2) => ({ key: title.toLowerCase(), title, markets: [{ key: 'player_points', last_update: at, outcomes: outcomes(line, over, under) }] });
const fixture = () => ({ ...event, bookmakers: [book('A', 20.5, 2.1, 1.8), book('B'), book('C', 21.5, 2.5, 1.6)] });
const snap = (quotes = calculateQuotes(fixture(), now)): OddsSnapshot => ({ eventId: 'f4000000-0000-4000-8000-000000000001', observedAt: at, quotes, markets: ['Points'], creditsRemaining: 496 });

it('normalizes implied probability and pairs no-vig only at the same line; never calls that EV', () => {
  const quotes = calculateQuotes(fixture(), now);
  const a = quotes.find((q) => q.book === 'A' && q.side === 'Over')!;
  expect(a.implied).toBeCloseTo(1 / 2.1);
  expect(a.noVig).toBeCloseTo((1 / 2.1) / (1 / 2.1 + 1 / 1.8));
  expect(a.best).toBe(true);
  expect(a.consensus).toBeCloseTo((a.noVig! + 0.5) / 2);
  expect(quotes.find((q) => q.book === 'C')!.best).toBe(false);
  expect(quotes.find((q) => q.book === 'C')!.consensus).toBeNull();
});
it('does not infer no-vig from missing opposing outcomes or different player lines', () => {
  const raw = fixture(); raw.bookmakers[0].markets[0].outcomes[1].point = 22.5;
  expect(calculateQuotes(raw, now).filter((q) => q.book === 'A').every((q) => q.noVig === null)).toBe(true);
});
it('removes stale and future book prices from best-price and consensus calculations', () => {
  const raw = fixture(); raw.bookmakers[0].markets[0].last_update = '2026-09-10T22:00:00Z';
  expect(calculateQuotes(raw, now).find((q) => q.book === 'A')!.best).toBe(false);
  expect(calculateQuotes(raw, now).find((q) => q.book === 'B')!.consensus).toBeNull();
  expect(calculateQuotes(fixture(), now - 60000).every((q) => !q.best)).toBe(true);
});
it('pairs opposite spreads while refusing a three-way moneyline', () => {
  const raw = EventOddsSchema.parse({ ...event, bookmakers: [{ key: 'a', title: 'A', markets: [{ key: 'spreads', last_update: at, outcomes: [{ name: event.home_team, point: -3.5, price: 1.9 }, { name: event.away_team, point: 3.5, price: 1.9 }] }, { key: 'h2h', last_update: at, outcomes: [{ name: event.home_team, price: 2 }, { name: event.away_team, price: 2 }, { name: 'Draw', price: 10 }] }] }] });
  const q = calculateQuotes(raw, now);
  expect(q.filter((q) => q.market === 'Spread').every((q) => q.noVig === 0.5)).toBe(true);
  expect(q.filter((q) => q.market === 'Moneyline').every((q) => q.noVig === null)).toBe(true);
});
it('limits markets and uses only the single-event current endpoint', async () => {
  expect(() => selectedMarkets('h2h,unknown')).toThrow('odds_invalid_markets');
  const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify(fixture()), { headers: { 'x-requests-remaining': '496' } }));
  await new OddsClient('test-only', fetcher).odds('event1', ['player_points']);
  const url = fetcher.mock.calls[0][0] as URL;
  expect(url.pathname).toBe('/v4/sports/basketball_nba/events/event1/odds');
  expect(url.searchParams.get('regions')).toBe('us');
  expect(url.searchParams.get('oddsFormat')).toBe('decimal');
});
it('requires both exact teams and time and refuses ambiguous event matches', () => {
  const game = { id: snap().eventId, home: { name: event.home_team }, away: { name: event.away_team }, startsAt: event.commence_time } as ScheduleGame;
  expect(matchEvent(event, [game])?.id).toBe(game.id);
  expect(matchEvent(event, [game, game])).toBeNull();
  expect(matchEvent(event, [{ ...game, startsAt: at }])).toBeNull();
});
it('detects only changes between observations of the same event and market selection', () => {
  const prior = snap();
  const current = { ...snap(calculateQuotes({ ...event, bookmakers: [book('A', 22.5), book('B', 20.5, 2.5, 1.7), book('D')] }, now)), observedAt: '2026-09-12T04:00:00Z' };
  expect(changes(prior, current).map((a) => a.kind)).toEqual(expect.arrayContaining(['line_changed', 'market_removed', 'new_best_price']));
  expect(changes(null, current)).toEqual([]);
  expect(changes(prior, { ...current, markets: ['Rebounds'] })).toEqual([]);
});
it('requires corroborating artwork identity and rejects unsafe image URLs', () => {
  const team = { name: 'Boston Celtics', abbreviation: 'BOS' };
  expect(matchArtworkTeam(team, [{ idTeam: '1', strTeam: team.name, strTeamShort: 'BOS', strLeague: 'NFL' }])).toBeNull();
  expect(artworkUrl('https://evil.example/image.png')).toBeNull();
  expect(artworkUrl('https://r2.thesportsdb.com/image.png')).toBeTruthy();
});
it.each(['busy', 'cooldown', 'budget_exhausted'])('does not call a provider when %s', async (reason) => {
  const db = { query: vi.fn(async (sql: string) => sql.includes('pg_try') ? { rows: [{ acquired: reason !== 'busy' }] } : sql.startsWith('select *') ? { rows: [{ reserved: reason === 'budget_exhausted' ? 100 : 0, last_attempt_at: reason === 'cooldown' ? new Date() : null }] } : { rows: [] }) } as unknown as PoolClient;
  const client = { events: vi.fn(), odds: vi.fn() } as unknown as OddsClient;
  expect((await importOdds(db, client)).status).toBe(reason);
  expect(client.events).not.toHaveBeenCalled(); expect(client.odds).not.toHaveBeenCalled();
});
it('reports unavailable, stale, and recent prepared views honestly', () => {
  expect(freshness(undefined, 900, now)).toBe('unavailable');
  expect(freshness(at, 900, now)).toBe('fresh');
  expect(freshness(at, 900, now + 901000)).toBe('stale');
});
