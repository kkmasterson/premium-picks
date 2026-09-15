// NBA season listing and weekly import timing; all persisted timestamps are UTC.
export function nbaSeasonWindow(now = new Date()) {
  const arizona = new Date(now.getTime() - 7 * 60 * 60 * 1000);
  const year = arizona.getUTCFullYear() - (arizona.getUTCMonth() < 8 ? 1 : 0);
  return { start: `${year}-09-01`, end: `${year + 1}-08-31` };
}

export function nextScheduleCheck(now = new Date()) {
  // Monday 04:00 Arizona = Monday 11:00 UTC, year round.
  const next = new Date(now);
  next.setUTCHours(11, 0, 0, 0);
  next.setUTCDate(next.getUTCDate() + (8 - next.getUTCDay()) % 7);
  if (next.getTime() <= now.getTime()) next.setUTCDate(next.getUTCDate() + 7);
  return next.toISOString();
}
