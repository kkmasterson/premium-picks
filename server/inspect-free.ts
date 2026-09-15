import { databasePool } from './db.js';
const pool = databasePool()!;
try {
  const summary = await pool.query(`select key,case when key='directory' then jsonb_build_object('teams',jsonb_array_length(payload->'teams'),'players',jsonb_array_length(payload->'players'),'complete',payload->'complete') else payload end as summary from arena_private.free_datasets where key='directory'`);
  console.info(summary.rows);
  console.info('artwork', (await pool.query("select kind,count(*) from arena_private.entity_enrichment group by kind")).rows);
  const unmatched = (await pool.query("select key,payload from arena_private.free_datasets where key like 'artwork-unmatched-%'")).rows;
  console.info('unmatched artwork', JSON.stringify(unmatched.map((r) => ({ key: r.key, candidates: r.payload.map((p: Record<string, unknown>) => ({ name: p.strTeam ?? p.strPlayer, abbreviation: p.strTeamShort, league: p.strLeague, sport: p.strSport, team: p.idTeam, cc: p.strCreativeCommons })) }))));
  console.info('odds', (await pool.query("select event_id,jsonb_array_length(payload->'quotes') as quotes,payload->'creditsRemaining' as remaining from arena_private.odds_observations order by observed_at desc limit 1")).rows);
} catch { console.error('inspection_failed'); process.exitCode = 1; }
finally { await pool.end(); }
