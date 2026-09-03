import { describe, expect, it } from 'vitest';
import { PROP_BOARD_ROWS, builderSelectionFor, metricsFor, offerFor, redactEvForTier } from '@/features/dashboard/props-fixtures';
import { deduplicatePassiveViews, eventWeight, popularitySummary } from '@/features/dashboard/popularity';
import type { PopularityEvent } from '@arena/contracts';

describe('Arena Props vertical-slice contracts', () => {
  it('covers every explicit line type and selects metrics by exact line', () => {
    const types = new Set(PROP_BOARD_ROWS.flatMap((row) => row.offers.map((offer) => offer.lineType)));
    expect(types).toEqual(new Set(['regular', 'goblin', 'devil', 'alternate']));
    const row = PROP_BOARD_ROWS[0]; const offer = row.offers.find((candidate) => candidate.lineType === 'devil')!;
    expect(metricsFor(row, offer.line).line).toBe(offer.line);
  });

  it('keeps selected-book moneyline unavailable rather than falling back', () => {
    const row = PROP_BOARD_ROWS.find((candidate) => candidate.moneylines.some((price) => price.playerTeamOdds === null))!;
    const moneyline = row.moneylines.find((price) => price.playerTeamOdds === null)!;
    expect(row.moneylines.find((price) => price.providerId === moneyline.providerId)?.playerTeamOdds).toBeNull();
  });

  it('redacts all Tier 2 EV details from Tier 1', () => {
    const offer = offerFor(PROP_BOARD_ROWS[0]);
    expect(redactEvForTier(offer.ev.over, 'tier1').details).toBeNull();
  });

  it('uses prop, offer, and side as Builder identity', () => {
    const row = PROP_BOARD_ROWS[0]; const offer = offerFor(row);
    expect(builderSelectionFor(row, offer, 'over').key).not.toBe(builderSelectionFor(row, offer, 'under').key);
  });
});

describe('Popular weighting', () => {
  const now = new Date('2026-09-01T12:00:00.000Z');
  const event = (id: string, action: PopularityEvent['action'], occurredAt: string): PopularityEvent => ({ id, propId: 'prop', actorId: 'user', action, side: action === 'side_selection' ? 'over' : null, occurredAt });
  it('loses half its weight after six hours', () => {
    expect(eventWeight(event('now', 'builder_add', now.toISOString()), now)).toBe(5);
    expect(eventWeight(event('old', 'builder_add', '2026-09-01T06:00:00.000Z'), now)).toBeCloseTo(2.5);
  });
  it('ranks stronger intent over clicks and deduplicates views for 30 minutes', () => {
    const views = [event('v1', 'view', '2026-09-01T11:00:00.000Z'), event('v2', 'view', '2026-09-01T11:10:00.000Z')];
    expect(deduplicatePassiveViews(views)).toHaveLength(1);
    expect(popularitySummary([event('builder', 'builder_add', now.toISOString())], now).score).toBeGreaterThan(popularitySummary([event('view', 'view', now.toISOString())], now).score);
  });
});
