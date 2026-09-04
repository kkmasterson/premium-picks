import { describe, expect, it, vi } from 'vitest';
import { TheSportsDbV1Client } from './thesportsdb-v1-client';

function jsonResponse(value: unknown): Response {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

describe('TheSportsDbV1Client', () => {
  it('uses the published free key for player lookups', async () => {
    let requestedUrl = '';
    const fetcher = vi.fn(async (input: Parameters<typeof fetch>[0]) => {
      requestedUrl = String(input);
      return jsonResponse({
        players: [{
          idPlayer: '34153733',
          strPlayer: 'Example Player',
          strThumb: 'https://r2.thesportsdb.com/images/media/player/thumb/example.jpg',
          strCutout: null,
          strCreativeCommons: 'Yes',
        }],
      });
    });
    const client = new TheSportsDbV1Client({ fetcher: fetcher as typeof fetch });

    await expect(client.lookupPlayer('34153733')).resolves.toMatchObject({ idPlayer: '34153733' });
    expect(requestedUrl).toBe('https://www.thesportsdb.com/api/v1/json/123/lookupplayer.php?id=34153733');
  });

  it('supports team and limited sport fixtures through the same free client', async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(jsonResponse({
        teams: [{
          idTeam: '134867',
          strTeam: 'Example Team',
          strBadge: 'https://r2.thesportsdb.com/images/media/team/badge/example.png',
          strLogo: null,
        }],
      }))
      .mockResolvedValueOnce(jsonResponse({
        sports: [{
          idSport: '102',
          strSport: 'Soccer',
          strSportIconGreen: 'https://www.thesportsdb.com/images/icons/sports/soccer.png',
        }],
      }));
    const client = new TheSportsDbV1Client({ fetcher: fetcher as typeof fetch });

    await expect(client.lookupTeam('134867')).resolves.toMatchObject({ idTeam: '134867' });
    await expect(client.listSports()).resolves.toHaveLength(1);
  });

  it('surfaces the free-tier rate limit distinctly', async () => {
    const client = new TheSportsDbV1Client({
      fetcher: vi.fn(async () => new Response(null, { status: 429 })) as typeof fetch,
    });

    await expect(client.lookupPlayer('34153733')).rejects.toThrow('thesportsdb_free_rate_limit');
  });

  it('rejects non-numeric provider IDs before making a request', async () => {
    const fetcher = vi.fn();
    const client = new TheSportsDbV1Client({ fetcher: fetcher as typeof fetch });

    await expect(client.lookupPlayer('../admin')).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });
});
