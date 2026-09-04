import {
  PropBoardRowSchema,
  type AccessTier,
  type BuilderSelection,
  type Confidence,
  type EvAccess,
  type HitRate,
  type LineType,
  type PropBoardRow,
  type PropLineMetrics,
  type PropOffer,
  type Side,
  type SideMetrics,
} from '@arena/contracts';
import { BOOKS, PROPS, playerById } from '@/features/dashboard/data';
import { playerMediaFor } from '@/features/dashboard/media-fixtures';
import type { Prop } from '@/features/dashboard/types';

const DEMO_NOW = new Date('2026-09-01T20:00:00.000Z');
const providerEntries = Object.entries(BOOKS);

function isoSecondsAgo(seconds: number): string {
  return new Date(DEMO_NOW.getTime() - seconds * 1000).toISOString();
}

function rate(values: number[], line: number, side: Side, sample: number): HitRate {
  const selected = values.slice(0, sample);
  const hits = selected.filter((value) => side === 'over' ? value > line : value < line).length;
  return { hits, total: selected.length, pct: selected.length ? Math.round(hits / selected.length * 100) : 0 };
}

function streak(values: number[], line: number): SideMetrics['streak'] {
  if (!values.length) return { side: 'over', count: 0 };
  const side: Side = values[0] > line ? 'over' : 'under';
  let count = 0;
  for (const value of values) {
    if ((side === 'over' && value > line) || (side === 'under' && value < line)) count += 1;
    else break;
  }
  return { side, count };
}

function confidenceFor(line: number, projection: number, l10: HitRate, h2h: HitRate): Confidence {
  const edgeScore = Math.max(0, Math.min(100, 50 + (projection - line) * 9));
  const score = Math.max(0, Math.min(100, Math.round(l10.pct * 0.45 + h2h.pct * 0.15 + edgeScore * 0.4)));
  const grade = score >= 80 ? 'High' : score >= 68 ? 'Strong' : score >= 52 ? 'Moderate' : 'Low';
  return {
    score,
    grade,
    version: 'fixture-confidence-v1',
    calculatedAt: DEMO_NOW.toISOString(),
    demo: true,
    components: [
      { label: 'Recent hit evidence', score: l10.pct, contribution: Math.round(l10.pct * 0.45) },
      { label: 'Head-to-head context', score: h2h.pct, contribution: Math.round(h2h.pct * 0.15) },
      { label: 'Model/price edge', score: Math.round(edgeScore), contribution: Math.round(edgeScore * 0.4) },
    ],
  };
}

function sideMetrics(prop: Prop, line: number, side: Side): SideMetrics {
  const values = prop.gameLog.map((entry) => entry.value);
  const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : prop.avg;
  const l10 = rate(values, line, side, 10);
  const h2h = rate(values.filter((_, index) => index % 3 === 0), line, side, 5);
  const projection = Number(prop.projection.toFixed(1));
  return {
    average: Number(average.toFixed(1)),
    projection,
    edge: Number(((side === 'over' ? projection - line : line - projection)).toFixed(1)),
    l5: rate(values, line, side, 5),
    l10,
    l15: rate(values, line, side, 15),
    season: rate(values, line, side, values.length),
    h2h,
    streak: streak(values, line),
    confidence: confidenceFor(line, projection, l10, h2h),
  };
}

function americanImplied(odds: number): number {
  return odds > 0 ? 100 / (odds + 100) : Math.abs(odds) / (Math.abs(odds) + 100);
}

function evAccess(odds: number | null, projectionEdge: number, side: Side): EvAccess {
  if (odds === null) return { positiveEvDetected: false, details: null };
  const impliedProbability = americanImplied(odds);
  const fairProbability = Math.max(0.08, Math.min(0.92, 0.5 + (side === 'over' ? projectionEdge : -projectionEdge) * 0.018));
  const decimalProfit = odds > 0 ? odds / 100 : 100 / Math.abs(odds);
  const evPercent = (fairProbability * decimalProfit - (1 - fairProbability)) * 100;
  const fairOdds = fairProbability >= 0.5
    ? -100 * fairProbability / (1 - fairProbability)
    : 100 * (1 - fairProbability) / fairProbability;
  return {
    positiveEvDetected: evPercent > 0,
    details: {
      evPercent: Number(evPercent.toFixed(1)),
      impliedProbability: Number(impliedProbability.toFixed(4)),
      fairProbability: Number(fairProbability.toFixed(4)),
      fairOdds: Math.round(fairOdds),
      edge: Number((fairProbability - impliedProbability).toFixed(4)),
      modelVersion: 'fixture-ev-v1',
      inputCutoff: DEMO_NOW.toISOString(),
      demo: true,
    },
  };
}

function lineTypeFor(index: number): LineType {
  return (['regular', 'goblin', 'devil', 'alternate'] as const)[index % 4];
}

function lineFor(prop: Prop, type: LineType): number {
  if (type === 'goblin') return Math.max(0.5, prop.line - 1);
  if (type === 'devil') return prop.line + 1;
  if (type === 'alternate') return prop.line + 0.5;
  return prop.line;
}

function buildOffers(prop: Prop, propIndex: number): PropOffer[] {
  return providerEntries.slice(0, 4).map(([shortName, providerName], offerIndex) => {
    const source = prop.books.find((book) => book.book === shortName) ?? prop.books[offerIndex % prop.books.length];
    const lineType = lineTypeFor(offerIndex);
    const line = lineFor(prop, lineType);
    const overOdds = source?.over ?? -110;
    const underOdds = source?.under ?? -110;
    const status = propIndex % 17 === 0 && offerIndex === 3
      ? 'suspended'
      : propIndex % 13 === 0 && offerIndex === 2
        ? 'stale'
        : 'active';
    return {
      id: `${prop.id}:offer:${shortName}:${lineType}`,
      providerId: `book-${shortName.toLowerCase()}`,
      providerName,
      providerShortName: shortName,
      lineType,
      line,
      overOdds,
      underOdds,
      payoutMultiplier: null,
      status,
      observedAt: isoSecondsAgo((source?.updatedAt ?? 20) + offerIndex * 8),
      ev: {
        over: evAccess(overOdds, prop.projection - line, 'over'),
        under: evAccess(underOdds, line - prop.projection, 'under'),
      },
    };
  });
}

function buildRow(prop: Prop, index: number): PropBoardRow {
  const player = playerById(prop.playerId);
  if (!player) throw new Error(`Missing fixture player for ${prop.playerId}`);
  const offers = buildOffers(prop, index);
  const lines = [...new Set(offers.map((offer) => offer.line))].sort((a, b) => a - b);
  const metricsByLine: PropLineMetrics[] = lines.map((line) => ({
    line,
    over: sideMetrics(prop, line, 'over'),
    under: sideMetrics(prop, line, 'under'),
  }));
  const phase = index % 11 === 0 ? 'live' : 'pregame';
  return {
    id: prop.id,
    playerId: player.id,
    playerName: player.name,
    headshotUrl: playerMediaFor(player.id)?.headshotUrl ?? null,
    team: player.team,
    position: player.pos,
    opponent: player.opponent,
    sport: player.sport,
    market: prop.market,
    event: {
      id: player.gameId,
      phase,
      startTimeLabel: player.gameTime,
      statusLabel: phase === 'live' ? (player.sport === 'NBA' ? 'LIVE · Q2' : 'LIVE') : 'Pregame',
    },
    offers,
    defaultOfferId: offers.find((offer) => offer.status === 'active' && offer.lineType === 'regular')?.id
      ?? offers.find((offer) => offer.status === 'active')?.id
      ?? offers[0].id,
    metricsByLine,
    moneylines: offers.map((offer, offerIndex) => ({
      providerId: offer.providerId,
      providerShortName: offer.providerShortName,
      playerTeamOdds: offerIndex === 3 && index % 5 === 0 ? null : -105 - offerIndex * 7,
      opponentOdds: offerIndex === 3 && index % 5 === 0 ? null : 100 + offerIndex * 8,
      status: offer.status,
      observedAt: offer.observedAt,
    })),
    lineMovement: offers.flatMap((offer, offerIndex) => [2, 1, 0].map((step) => ({
      providerId: offer.providerId,
      observedAt: isoSecondsAgo(step * 3600 + offerIndex * 120),
      line: Number((offer.line - step * (offerIndex % 2 === 0 ? 0.5 : -0.5)).toFixed(1)),
      direction: step === 0 ? (offerIndex % 2 === 0 ? 'up' : 'down') : 'flat',
    }))),
  };
}

export const PROP_BOARD_ROWS: PropBoardRow[] = PropBoardRowSchema.array().parse(PROPS.map(buildRow));

export function propBoardRowById(propId: string): PropBoardRow | undefined {
  return PROP_BOARD_ROWS.find((row) => row.id === propId);
}

export function offerFor(row: PropBoardRow, offerId?: string): PropOffer {
  return row.offers.find((offer) => offer.id === offerId)
    ?? row.offers.find((offer) => offer.id === row.defaultOfferId)
    ?? row.offers[0];
}

export function metricsFor(row: PropBoardRow, line: number): PropLineMetrics {
  return row.metricsByLine.find((metrics) => metrics.line === line) ?? row.metricsByLine[0];
}

export function redactEvForTier(access: EvAccess, tier: AccessTier): EvAccess {
  return tier === 'tier2' ? access : { positiveEvDetected: access.positiveEvDetected, details: null };
}

export function builderSelectionFor(row: PropBoardRow, offer: PropOffer, side: Side): BuilderSelection {
  return {
    key: `${row.id}:${offer.id}:${side}`,
    propId: row.id,
    offerId: offer.id,
    side,
    providerId: offer.providerId,
    providerName: offer.providerName,
    providerShortName: offer.providerShortName,
    lineType: offer.lineType,
    capturedLine: offer.line,
    capturedOdds: side === 'over' ? offer.overOdds : offer.underOdds,
    payoutMultiplier: offer.payoutMultiplier,
    capturedAt: offer.observedAt,
  };
}
