import { describe, expect, it } from 'vitest';
import { BASKETBALL_SHOT_ZONE_POSITIONS, positionSoccer433 } from './spatialLayouts';

describe('spatial sport layouts', () => {
  it('places basketball zones relative to a bottom-center basket', () => {
    const zones = BASKETBALL_SHOT_ZONE_POSITIONS;
    expect(zones.rim.x).toBe(50);
    expect(zones.rim.y).toBeGreaterThan(zones['left-wing'].y);
    expect(zones.center.y).toBeLessThan(zones['left-wing'].y);
    expect(zones['left-corner'].x).toBeLessThan(zones.rim.x);
    expect(zones['right-corner'].x).toBeGreaterThan(zones.rim.x);
    expect(zones['left-corner'].y).toBeGreaterThan(zones['left-wing'].y);
    expect(zones['right-corner'].y).toBeGreaterThan(zones['right-wing'].y);
  });

  it('assigns a 4-3-3 lineup from goalkeeper through attack', () => {
    const lineup = [
      { name: 'GK', position: 'GK' },
      ...Array.from({ length: 4 }, (_, index) => ({ name: `D${index}`, position: 'D' })),
      ...Array.from({ length: 3 }, (_, index) => ({ name: `M${index}`, position: 'M' })),
      ...Array.from({ length: 3 }, (_, index) => ({ name: `F${index}`, position: 'F' })),
    ];
    const positioned = positionSoccer433(lineup);
    const byRole = (role: string) => positioned.filter((item) => item.player.position === role);

    expect(byRole('GK')).toHaveLength(1);
    expect(byRole('D')).toHaveLength(4);
    expect(byRole('M')).toHaveLength(3);
    expect(byRole('F')).toHaveLength(3);
    expect(byRole('GK')[0].point.y).toBeGreaterThan(byRole('D')[0].point.y);
    expect(byRole('D')[0].point.y).toBeGreaterThan(byRole('M')[0].point.y);
    expect(byRole('M')[0].point.y).toBeGreaterThan(byRole('F')[0].point.y);
  });
});

