import type { PopularityAction, PopularityEvent, Side } from '@arena/contracts';

export const POPULARITY_POINTS: Record<PopularityAction, number> = { builder_add: 5, save: 4, side_selection: 3, view: 1 };

export function eventWeight(event: PopularityEvent, now: Date) {
  const ageHours = Math.max(0, (now.getTime() - new Date(event.occurredAt).getTime()) / 3_600_000);
  return POPULARITY_POINTS[event.action] * 0.5 ** (ageHours / 6);
}

export function deduplicatePassiveViews(events: PopularityEvent[]) {
  const last = new Map<string, number>();
  return [...events].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt)).filter((event) => {
    if (event.action !== 'view') return true;
    const key = `${event.actorId}:${event.propId}`;
    const time = new Date(event.occurredAt).getTime();
    const previous = last.get(key);
    last.set(key, time);
    return previous === undefined || time - previous >= 30 * 60_000;
  });
}

export function popularitySummary(events: PopularityEvent[], now: Date) {
  const valid = deduplicatePassiveViews(events);
  let over = 0; let under = 0;
  for (const event of valid) {
    if (event.action !== 'side_selection') continue;
    if (event.side === 'over') over += 1;
    if (event.side === 'under') under += 1;
  }
  const sampleSize = over + under;
  return { score: valid.reduce((sum, event) => sum + eventWeight(event, now), 0), totalActivity: valid.length, sampleSize, overPct: sampleSize ? Math.round(over / sampleSize * 100) : 50, underPct: sampleSize ? Math.round(under / sampleSize * 100) : 50 };
}

export function fixturePopularity(propId: string) {
  const seed = [...propId].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const now = new Date('2026-09-01T20:00:00.000Z');
  const events: PopularityEvent[] = [];
  const actions: PopularityAction[] = ['builder_add', 'save', 'side_selection', 'side_selection', 'view'];
  for (let index = 0; index < 12 + seed % 17; index++) {
    const action = actions[index % actions.length];
    const side: Side | null = action === 'side_selection' ? ((index + seed) % 4 ? 'over' : 'under') : null;
    events.push({ id: `${propId}:${index}`, propId, actorId: `fixture-user-${index % 9}`, action, side, occurredAt: new Date(now.getTime() - ((index * 23 + seed) % 720) * 60_000).toISOString() });
  }
  return popularitySummary(events, now);
}
