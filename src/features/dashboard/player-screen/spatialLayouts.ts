export interface SpatialPoint {
  x: number;
  y: number;
}

export type BasketballShotZoneId = 'rim' | 'left-corner' | 'right-corner' | 'left-wing' | 'right-wing' | 'center';

/**
 * Coordinates use a basket-at-the-bottom half court. Values are percentages
 * of the rendered surface so the same topology survives responsive resizing.
 */
export const BASKETBALL_SHOT_ZONE_POSITIONS: Record<BasketballShotZoneId, SpatialPoint> = {
  center: { x: 50, y: 17 },
  'left-wing': { x: 20, y: 45 },
  'right-wing': { x: 80, y: 45 },
  'left-corner': { x: 13, y: 83 },
  rim: { x: 50, y: 82 },
  'right-corner': { x: 87, y: 83 },
};

const SOCCER_433_SLOTS: Record<string, SpatialPoint[]> = {
  GK: [{ x: 50, y: 91 }],
  D: [{ x: 14, y: 70 }, { x: 38, y: 72 }, { x: 62, y: 72 }, { x: 86, y: 70 }],
  M: [{ x: 24, y: 48 }, { x: 50, y: 43 }, { x: 76, y: 48 }],
  F: [{ x: 20, y: 20 }, { x: 50, y: 16 }, { x: 80, y: 20 }],
};

export interface FormationPlayer {
  name: string;
  position: string;
  current?: boolean;
}

export interface PositionedFormationPlayer<T extends FormationPlayer> {
  player: T;
  point: SpatialPoint;
  roleIndex: number;
}

export function positionSoccer433<T extends FormationPlayer>(lineup: T[]): PositionedFormationPlayer<T>[] {
  const usedByRole: Record<string, number> = {};
  return lineup.map((player, lineupIndex) => {
    const roleIndex = usedByRole[player.position] ?? 0;
    usedByRole[player.position] = roleIndex + 1;
    const roleSlots = SOCCER_433_SLOTS[player.position] ?? [];
    const point = roleSlots[roleIndex] ?? { x: 50, y: 50 + Math.min(lineupIndex, 4) * 4 };
    return { player, point, roleIndex };
  });
}

