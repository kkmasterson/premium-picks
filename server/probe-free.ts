import { databasePool } from './db.js';

const pool = databasePool();
try {
  if (!pool) console.info('database: missing');
  else {
    const result = await pool.query("select to_regclass('arena_private.schedule_generations') is not null as migrated");
    console.info('database: connected; schedule migrated=' + result.rows[0].migrated);
  }
} catch { console.info('database: unavailable'); }
finally { await pool?.end(); }
for (const [name, base, key] of [
  ['nba', 'https://api.balldontlie.io/v1/teams', process.env.BALLDONTLIE_API_KEY],
  ['odds', 'https://api.the-odds-api.com/v4/sports/basketball_nba/events', process.env.THE_ODDS_API_KEY],
  ['media', 'https://www.thesportsdb.com/api/v1/json/123/search_all_teams.php?l=NBA', '123'],
] as const) {
  if (!key?.trim()) { console.info(`${name}: missing`); continue; }
  const url = new URL(base);
  if (name === 'odds') url.searchParams.set('apiKey', key);
  try {
    const response = await fetch(url, { headers: name === 'nba' ? { Authorization: key } : {}, signal: AbortSignal.timeout(15000), redirect: 'error' });
    const data = await response.json() as { data?: unknown[]; teams?: unknown[] } | unknown[];
    console.info(JSON.stringify({ provider: name, status: response.status, count: Array.isArray(data) ? data.length : data.data?.length ?? data.teams?.length, remaining: response.headers.get('x-requests-remaining') }));
  } catch { console.info(`${name}: network_or_response_error`); }
}
