import { describe, expect, it } from 'vitest';
import { PropBoardRowSchema } from '@arena/contracts';
import { PROP_BOARD_ROWS } from '@/features/dashboard/props-fixtures';
import { LIVE_DEMO_REFRESH_MS, liveDemoRowsAt } from '@/features/dashboard/live-demo';

describe('live demo feed', () => {
  it('keeps the canonical read model valid while refreshing timestamps', () => {
    const now = Date.parse('2026-09-03T12:00:00.000Z');
    const rows = liveDemoRowsAt(now);
    expect(() => PropBoardRowSchema.array().parse(rows)).not.toThrow();
    expect(new Date(rows[0].offers[0].observedAt).getTime()).toBeLessThanOrEqual(now);
    expect(rows[0].offers[0].ev.over.details?.demo).toBe(true);
  });

  it('updates market values without changing canonical offer identity or historical hit rates', () => {
    const now = Date.parse('2026-09-03T12:00:00.000Z');
    const first = liveDemoRowsAt(now);
    const second = liveDemoRowsAt(now + LIVE_DEMO_REFRESH_MS);
    expect(second[0].offers[0].id).toBe(first[0].offers[0].id);
    expect(second[0].metricsByLine[0].over.l10).toEqual(PROP_BOARD_ROWS[0].metricsByLine[0].over.l10);
    expect(second.some((row, index) => row.offers.some((offer, offerIndex) => offer.overOdds !== first[index].offers[offerIndex].overOdds))).toBe(true);
  });

  it('labels confidence as a demo model with hit rate, H2H, EV and projection inputs', () => {
    const row = liveDemoRowsAt(Date.parse('2026-09-03T12:00:00.000Z'))[0];
    const confidence = row.metricsByLine[0].over.confidence;
    expect(confidence?.version).toBe('live-demo-confidence-v2');
    expect(confidence?.components.map((component) => component.label)).toEqual([
      'Last 10 hit rate',
      'Head-to-head',
      'Positive EV signal',
      'Projection edge',
    ]);
  });
});
