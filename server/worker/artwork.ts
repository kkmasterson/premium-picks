import { z } from 'zod';
import type { PoolClient } from 'pg';
import { DirectorySchema } from '../../packages/contracts/src/free-data.js';
import { loadDataset, saveDataset } from './free-store.js';

const mediaTeam = z.object({ idTeam: z.string(), strTeam: z.string(), strLeague: z.string().nullish(), strTeamShort: z.string().nullish(), strBadge: z.string().nullish(), strStadium: z.string().nullish() });
const mediaPlayer = z.object({ idPlayer: z.string(), strPlayer: z.string(), idTeam: z.string().nullish(), strSport: z.string().nullish(), strThumb: z.string().nullish(), strCreativeCommons: z.string().nullish() });
const teamAliases: Record<string, string> = { 'LA Clippers': 'Los Angeles Clippers' };
const playerAliases: Record<string, string> = { 'Nikola Jokic': 'Nikola Jokić' };
export function artworkUrl(value: string | null | undefined) {
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === 'https:' && ['r2.thesportsdb.com', 'www.thesportsdb.com'].includes(url.hostname) && !url.username && !url.password && !url.port ? url.href : null; } catch { return null; }
}
/** Exact league, full name AND abbreviation required. Ambiguities stay private. */
export function matchArtworkTeam(team: { name: string; abbreviation: string }, candidates: z.infer<typeof mediaTeam>[]) {
  const matches = candidates.filter((c) => c.strLeague === 'NBA' && c.strTeam === (teamAliases[team.name] ?? team.name) && c.strTeamShort === team.abbreviation);
  return matches.length === 1 ? matches[0] : null;
}
export async function importArtwork(db: PoolClient, fetcher = fetch) {
  const locked = (await db.query('select pg_try_advisory_lock(821904) as acquired')).rows[0].acquired;
  if (!locked) return { status: 'busy' };
  try {
    const directory = DirectorySchema.parse(await loadDataset(db, 'directory'));
    const last = z.object({ at: z.string() }).nullable().parse(await loadDataset(db, 'artwork-v2-last-attempt'));
    if (last && Date.now() - Date.parse(last.at) < 86400000) return { status: 'not_due' };
    await saveDataset(db, 'artwork-v2-last-attempt', { at: new Date().toISOString() });
    let lastRequest = 0;
    const request = async (path: string, params: Record<string, string>) => {
      const delay = 2200 - (Date.now() - lastRequest);
      if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
      const key = process.env.THESPORTSDB_API_KEY || '123';
      if (!/^\d+$/.test(key)) throw new Error('media_invalid_key');
      const url = new URL(`https://www.thesportsdb.com/api/v1/json/${key}/${path}`);
      for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
      lastRequest = Date.now();
      let response: Response;
      try { response = await fetcher(url, { signal: AbortSignal.timeout(15000), redirect: 'error' }); } catch { throw new Error('media_network_error'); }
      if (!response.ok) throw new Error(`media_http_${response.status}`);
      return response.json() as Promise<unknown>;
    };
    const put = async (id: string, providerId: string, kind: string, payload: unknown) => db.query(`insert into arena_private.entity_enrichment(entity_id,provider_entity_id,kind,payload) values ($1,$2,$3,$4) on conflict(entity_id) do update set payload=excluded.payload,provider_entity_id=excluded.provider_entity_id,observed_at=now()`, [id, providerId, kind, JSON.stringify(payload)]);
    let matched = 0;
    for (const team of directory.teams.filter((t) => t.conference && t.division)) {
      if ((await db.query("select 1 from arena_private.entity_enrichment where entity_id=$1 and observed_at > now()-interval '30 days'", [team.id])).rowCount) continue;
      const raw = await request('searchteams.php', { t: teamAliases[team.name] ?? team.name });
      const candidates = z.object({ teams: z.array(mediaTeam).nullable() }).parse(raw).teams ?? [];
      const match = matchArtworkTeam(team, candidates);
      if (!match) { await saveDataset(db, `artwork-unmatched-${team.id}`, candidates); continue; }
      await put(team.id, match.idTeam, 'team', { image: artworkUrl(match.strBadge), venue: match.strStadium || null, scope: 'development', rightsReference: 'https://www.thesportsdb.com/docs_terms_of_use.php' });
      matched++;
    }
    // A small, selected image proof. Exact name plus the verified team crosswalk,
    // basketball sport and affirmative Creative Commons metadata are required.
    const selectedNames = ['LeBron James', 'Stephen Curry', 'Kevin Durant', 'Jayson Tatum', 'Nikola Jokic'];
    let players = 0;
    for (const player of directory.players.filter((p) => selectedNames.includes(p.name))) {
      const team = (await db.query("select provider_entity_id from arena_private.entity_enrichment where entity_id=$1 and kind='team'", [player.teamId])).rows[0];
      if (!team) continue;
      const candidates = z.object({ player: z.array(mediaPlayer).nullable() }).parse(await request('searchplayers.php', { p: player.name })).player ?? [];
      const matches = candidates.filter((p) => p.strPlayer === (playerAliases[player.name] ?? player.name) && p.idTeam === team.provider_entity_id && p.strSport === 'Basketball');
      const candidate = matches.length === 1 ? matches[0] : null;
      const lookup = candidate ? z.object({ players: z.array(mediaPlayer).nullable() }).parse(await request('lookupplayer.php', { id: candidate.idPlayer })).players ?? [] : [];
      const match = lookup.find((p) => p.idPlayer === candidate?.idPlayer && p.strPlayer === candidate.strPlayer && p.idTeam === team.provider_entity_id && p.strSport === 'Basketball');
      if (!match || !/^(yes|true|1|cc(?:\s|[- ]by))/i.test(match.strCreativeCommons ?? '')) { await saveDataset(db, `artwork-unmatched-${player.id}`, candidates); continue; }
      await put(player.id, match.idPlayer, 'player', { image: artworkUrl(match.strThumb), scope: 'development', rightsReference: 'https://www.thesportsdb.com/docs_terms_of_use.php' }); players++;
    }
    const league = z.object({ leagues: z.array(z.object({ idLeague: z.string(), strLeague: z.string(), strSport: z.string(), strBadge: z.string().nullish() })).nullable() }).parse(await request('lookupleague.php', { id: '4387' })).leagues?.[0];
    if (league?.idLeague === '4387' && league.strLeague === 'NBA' && league.strSport === 'Basketball') await saveDataset(db, 'league-artwork', { image: artworkUrl(league.strBadge), scope: 'development' });
    return { status: 'published', teams: matched, players };
  } finally { await db.query('select pg_advisory_unlock(821904)').catch(() => {}); }
}
