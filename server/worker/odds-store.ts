import { createHash } from 'node:crypto';
import type { PoolClient } from 'pg';
import { OddsSnapshotSchema, type OddsSnapshot, type OddsView } from '../../packages/contracts/src/free-data.js';
import { ScheduleSnapshotSchema, type ScheduleGame } from '../../packages/contracts/src/schedule.js';
import { calculateQuotes, comparableKey, OddsClient, selectedMarkets, MARKET_LABELS, type OddsEvent } from './odds-client.js';
import { saveDataset } from './free-store.js';

export function matchEvent(event: OddsEvent, games: ScheduleGame[]) {
  // Exact team pair plus exact tipoff, unique across the imported schedule.
  const matches = games.filter((g) => g.home.name === event.home_team && g.away.name === event.away_team && g.startsAt && Date.parse(g.startsAt) === Date.parse(event.commence_time));
  return matches.length === 1 ? matches[0] : null;
}
export function changes(previous: OddsSnapshot | null, current: OddsSnapshot): OddsView['alerts'] {
  if (!previous || previous.eventId !== current.eventId || previous.markets.join('|') !== current.markets.join('|')) return [];
  const alerts: OddsView['alerts'] = [];
  const add = (kind: OddsView['alerts'][number]['kind'], description: string) => alerts.push({ id: createHash('sha256').update(`${current.observedAt}:${kind}:${description}`).digest('hex').slice(0, 24), observedAt: current.observedAt, kind, description });
  const identity = (q: OddsSnapshot['quotes'][number]) => JSON.stringify([q.book, q.market, q.subject, q.side]);
  for (const old of previous.quotes) {
    const currentGroup = current.quotes.filter((q) => identity(q) === identity(old));
    if (!currentGroup.length) add('market_removed', `${old.book}: ${old.subject} ${old.market} ${old.side} no longer observed`);
    else if (!currentGroup.some((q) => q.line === old.line) && currentGroup.length === 1 && previous.quotes.filter((q) => identity(q) === identity(old)).length === 1) add('line_changed', `${old.book}: ${old.subject} ${old.market} ${old.side} ${old.line} → ${currentGroup[0].line}`);
  }
  for (const q of current.quotes.filter((q) => q.best)) {
    const old = previous.quotes.filter((p) => comparableKey(p) === comparableKey(q));
    if (old.length && q.decimal > Math.max(...old.map((p) => p.decimal))) add('new_best_price', `${q.book}: ${q.subject} ${q.market} ${q.side} ${q.line ?? ''} now ${q.decimal.toFixed(2)}`);
  }
  return [...new Map(alerts.map((a) => [a.id, a])).values()];
}

export async function importOdds(db: PoolClient, client: OddsClient, requestedId?: string) {
  const locked = (await db.query('select pg_try_advisory_lock(821903) as acquired')).rows[0].acquired;
  if (!locked) return { status: 'busy' };
  try {
    const markets = selectedMarkets(process.env.ARENA_ODDS_MARKETS);
    // Conservative local allowance; the remaining header handles other consumers
    // and provider billing cycles. Unknown remaining allowance fails closed.
    const cap = Math.min(450, Math.max(0, Number(process.env.ARENA_ODDS_MONTHLY_CAP ?? 100)));
    if (!Number.isFinite(cap)) throw new Error('odds_invalid_budget');
    const month = new Date().toISOString().slice(0, 7);
    await db.query('insert into arena_private.odds_budget(month) values ($1) on conflict do nothing', [month]);
    const budget = (await db.query('select * from arena_private.odds_budget where month=$1', [month])).rows[0];
    if (budget.last_attempt_at && Date.now() - new Date(budget.last_attempt_at).getTime() < 6 * 3600000) return { status: 'cooldown' };
    if (budget.reserved + markets.length > cap) return { status: 'budget_exhausted' };
    // /events is quota-free; the cooldown above prevents restart loops.
    await db.query('update arena_private.odds_budget set last_attempt_at=now() where month=$1', [month]);
    const listing = await client.events();
    await db.query('update arena_private.odds_budget set remaining=$2,last_checked_at=now() where month=$1', [month, listing.remaining]);
    if (listing.remaining === null || listing.remaining < markets.length + 10) return { status: 'insufficient_credits' };
    const schedule = ScheduleSnapshotSchema.parse((await db.query("select payload from arena_private.schedule_generations where competition_key='nba'")).rows[0]?.payload);
    const candidates = listing.events.map((event) => ({ event, game: matchEvent(event, schedule.games) })).filter((item) => item.game && Date.parse(item.event.commence_time) > Date.now()).sort((a, b) => a.event.commence_time.localeCompare(b.event.commence_time));
    const selected = requestedId ? candidates.find((item) => item.game!.id === requestedId) : candidates[0];
    await saveDataset(db, 'odds-unmatched-events', listing.events.filter((e) => !matchEvent(e, schedule.games)));
    if (!selected) return { status: 'no_verified_event' };
    // Reserve BEFORE I/O, even if the network fails. Concurrent workers use the lock.
    await db.query('update arena_private.odds_budget set reserved=reserved+$2 where month=$1', [month, markets.length]);
    const result = await client.odds(selected.event.id, markets);
    if (result.event.id !== selected.event.id || matchEvent(result.event, schedule.games)?.id !== selected.game!.id) throw new Error('odds_event_mismatch');
    const current = OddsSnapshotSchema.parse({ eventId: selected.game!.id, observedAt: new Date().toISOString(), quotes: calculateQuotes(result.event), markets: markets.map((m) => MARKET_LABELS[m]), creditsRemaining: result.remaining });
    await db.query('begin');
    try {
      await db.query('insert into arena_private.odds_observations(event_id,observed_at,payload) values ($1,$2,$3)', [current.eventId, current.observedAt, JSON.stringify(current)]);
      await db.query('update arena_private.odds_budget set remaining=$2,last_checked_at=now() where month=$1', [month, result.remaining]);
      await saveDataset(db, `odds-raw-${current.eventId}`, result.event);
      await db.query('commit');
    } catch (error) { await db.query('rollback'); throw error; }
    return { status: 'published', eventId: current.eventId, quotes: current.quotes.length, creditsRemaining: result.remaining };
  } finally { await db.query('select pg_advisory_unlock(821903)').catch(() => {}); }
}
