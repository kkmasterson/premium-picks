import type { Confidence, EvAccess, PropBoardRow, PropOffer, Side, SideMetrics } from '@arena/contracts';
import { PROP_BOARD_ROWS } from '@/features/dashboard/props-fixtures';

export const LIVE_DEMO_REFRESH_MS = 15_000;

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function pulse(key: string, tick: number, spread: number): number {
  return (hash(`${key}:${tick}`) % (spread * 2 + 1)) - spread;
}

function normalizeAmerican(value: number): number {
  if (value >= 100 || value <= -100) return value;
  return value >= 0 ? value + 100 : value - 100;
}

function moveOdds(value: number | null, key: string, tick: number): number | null {
  if (value === null) return null;
  return normalizeAmerican(value + pulse(key, tick, 2) * 2);
}

function impliedProbability(odds: number): number {
  return odds > 0 ? 100 / (odds + 100) : Math.abs(odds) / (Math.abs(odds) + 100);
}

function updateEv(access: EvAccess, odds: number | null, nowIso: string): EvAccess {
  if (odds === null || !access.details) return { positiveEvDetected: false, details: null };
  const implied = impliedProbability(odds);
  const fair = access.details.fairProbability;
  const decimalProfit = odds > 0 ? odds / 100 : 100 / Math.abs(odds);
  const evPercent = Number(((fair * decimalProfit - (1 - fair)) * 100).toFixed(1));
  return {
    positiveEvDetected: evPercent > 0,
    details: {
      ...access.details,
      evPercent,
      impliedProbability: Number(implied.toFixed(4)),
      edge: Number((fair - implied).toFixed(4)),
      inputCutoff: nowIso,
      modelVersion: 'live-demo-ev-v2',
      demo: true,
    },
  };
}

function updateOffer(offer: PropOffer, rowId: string, tick: number, nowMs: number): PropOffer {
  const overOdds = moveOdds(offer.overOdds, `${rowId}:${offer.id}:over`, tick);
  const underOdds = moveOdds(offer.underOdds, `${rowId}:${offer.id}:under`, tick);
  const ageSeconds = offer.status === 'stale'
    ? 360 + hash(offer.id) % 240
    : offer.status === 'suspended'
      ? 75 + hash(offer.id) % 90
      : 3 + hash(`${offer.id}:${tick}`) % 12;
  const observedAt = new Date(nowMs - ageSeconds * 1000).toISOString();
  return {
    ...offer,
    overOdds,
    underOdds,
    observedAt,
    ev: {
      over: updateEv(offer.ev.over, overOdds, observedAt),
      under: updateEv(offer.ev.under, underOdds, observedAt),
    },
  };
}

function confidenceFor(metrics: SideMetrics, offers: PropOffer[], side: Side, nowIso: string): Confidence | null {
  if (!metrics.confidence || metrics.projection === null || metrics.edge === null) return null;
  const evPercent = Math.max(...offers.map((offer) => offer.ev[side].details?.evPercent ?? -25));
  const evScore = Math.max(0, Math.min(100, 50 + evPercent * 4));
  const projectionScore = Math.max(0, Math.min(100, 50 + metrics.edge * 10));
  const score = Math.round(
    metrics.l10.pct * 0.45
    + metrics.h2h.pct * 0.2
    + evScore * 0.2
    + projectionScore * 0.15,
  );
  const grade = score >= 80 ? 'High' : score >= 68 ? 'Strong' : score >= 52 ? 'Moderate' : 'Low';
  return {
    score,
    grade,
    version: 'live-demo-confidence-v2',
    calculatedAt: nowIso,
    demo: true,
    components: [
      { label: 'Last 10 hit rate', score: metrics.l10.pct, contribution: Math.round(metrics.l10.pct * 0.45) },
      { label: 'Head-to-head', score: metrics.h2h.pct, contribution: Math.round(metrics.h2h.pct * 0.2) },
      { label: 'Positive EV signal', score: Math.round(evScore), contribution: Math.round(evScore * 0.2) },
      { label: 'Projection edge', score: Math.round(projectionScore), contribution: Math.round(projectionScore * 0.15) },
    ],
  };
}

function liveStatus(row: PropBoardRow, tick: number): PropBoardRow['event'] {
  if (row.event.phase !== 'live') return row.event;
  const elapsedSeconds = (tick * 15 + hash(row.event.id) % 720) % 2880;
  const quarter = Math.min(4, Math.floor(elapsedSeconds / 720) + 1);
  const remaining = 720 - (elapsedSeconds % 720);
  const minutes = Math.floor(remaining / 60);
  const seconds = String(remaining % 60).padStart(2, '0');
  return { ...row.event, statusLabel: `LIVE · Q${quarter} ${minutes}:${seconds}` };
}

/**
 * Produces a deterministic, periodically changing demo feed. It is intentionally
 * simulation-only: no value in this function is sourced from a sportsbook.
 */
export function liveDemoRowsAt(nowMs = Date.now(), source: PropBoardRow[] = PROP_BOARD_ROWS): PropBoardRow[] {
  const tick = Math.floor(nowMs / LIVE_DEMO_REFRESH_MS);
  const nowIso = new Date(nowMs).toISOString();

  return source.map((row) => {
    const offers = row.offers.map((offer) => updateOffer(offer, row.id, tick, nowMs));
    const metricsByLine = row.metricsByLine.map((lineMetrics) => {
      const lineOffers = offers.filter((offer) => offer.line === lineMetrics.line);
      const updateSide = (metrics: SideMetrics, side: Side): SideMetrics => {
        if (metrics.projection === null) return metrics;
        const projection = Number((metrics.projection + pulse(`${row.id}:${lineMetrics.line}:${side}:projection`, tick, 2) / 10).toFixed(1));
        const edge = Number((side === 'over' ? projection - lineMetrics.line : lineMetrics.line - projection).toFixed(1));
        const next = { ...metrics, projection, edge };
        return { ...next, confidence: confidenceFor(next, lineOffers, side, nowIso) };
      };
      return { ...lineMetrics, over: updateSide(lineMetrics.over, 'over'), under: updateSide(lineMetrics.under, 'under') };
    });
    const moneylines = row.moneylines.map((moneyline) => ({
      ...moneyline,
      playerTeamOdds: moveOdds(moneyline.playerTeamOdds, `${row.id}:${moneyline.providerId}:team`, tick),
      opponentOdds: moveOdds(moneyline.opponentOdds, `${row.id}:${moneyline.providerId}:opponent`, tick),
      observedAt: new Date(nowMs - (4 + hash(`${moneyline.providerId}:${tick}`) % 14) * 1000).toISOString(),
    }));
    const currentMovement = offers.map((offer) => ({
      providerId: offer.providerId,
      observedAt: offer.observedAt,
      line: offer.line,
      direction: 'flat' as const,
    }));

    return {
      ...row,
      event: liveStatus(row, tick),
      offers,
      metricsByLine,
      moneylines,
      lineMovement: [...row.lineMovement, ...currentMovement],
    };
  });
}
