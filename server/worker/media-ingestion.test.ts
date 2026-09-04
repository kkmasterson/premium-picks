import { describe, expect, it, vi } from 'vitest';
import {
  importMediaCandidate,
  mapTheSportsDbPlayerMedia,
  mapTheSportsDbSportMedia,
  mapTheSportsDbTeamMedia,
  toPublicMediaAsset,
  type MediaCandidate,
  type MediaObjectStore,
} from './media-ingestion';

const png = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x28, 0x00, 0x00, 0x00, 0x28,
]);

function approvedCandidate(overrides: Partial<MediaCandidate> = {}): MediaCandidate {
  return {
    ownerType: 'player',
    ownerKey: 'player_1',
    kind: 'player_headshot',
    variant: 'square',
    sourceProvider: 'thesportsdb',
    sourceEntityId: '34153733',
    sourceUrl: 'https://r2.thesportsdb.com/images/media/player/thumb/example.png',
    alt: 'Example Player',
    priority: 0,
    rightsStatus: 'approved',
    rightsReference: 'https://www.thesportsdb.com/docs_terms_of_use.php',
    attributionText: 'Media sourced from TheSportsDB',
    attributionUrl: 'https://www.thesportsdb.com',
    licenseTag: 'Yes',
    transformPolicy: 'proportional_resize',
    ...overrides,
  };
}

describe('TheSportsDB media mapping', () => {
  it('maps player thumbs before transparent cutouts without auto-approving rights', () => {
    const assets = mapTheSportsDbPlayerMedia({
      idPlayer: '34153733',
      strPlayer: 'Example Player',
      strThumb: 'https://r2.thesportsdb.com/images/media/player/thumb/example.jpg',
      strCutout: 'https://r2.thesportsdb.com/images/media/player/cutout/example.png',
      strCreativeCommons: 'Yes',
    }, 'player_1');

    expect(assets.map(({ variant, priority }) => ({ variant, priority }))).toEqual([
      { variant: 'square', priority: 0 },
      { variant: 'transparent', priority: 1 },
    ]);
    expect(assets.every((asset) => asset.rightsStatus === 'pending')).toBe(true);
  });

  it('marks team badges and logos as as-is trademark assets', () => {
    const assets = mapTheSportsDbTeamMedia({
      idTeam: '134867',
      strTeam: 'Example Team',
      strBadge: 'https://r2.thesportsdb.com/images/media/team/badge/example.png',
      strLogo: 'https://r2.thesportsdb.com/images/media/team/logo/example.png',
    }, 'team_1');

    expect(assets.map((asset) => asset.kind)).toEqual(['team_badge', 'team_logo']);
    expect(assets.every((asset) => asset.transformPolicy === 'as_is')).toBe(true);
  });

  it('uses the same candidate contract for top-level sport icons', () => {
    const assets = mapTheSportsDbSportMedia({
      idSport: '106',
      strSport: 'Basketball',
      strSportIconGreen: 'https://www.thesportsdb.com/images/icons/sports/basketball.png',
    }, 'basketball');

    expect(assets[0]).toMatchObject({ ownerType: 'sport', kind: 'sport_icon', ownerKey: 'basketball' });
  });
});

describe('media importer', () => {
  it('downloads approved bytes to a deterministic public key and emits a public contract', async () => {
    let storedKey = '';
    const put = vi.fn(async (input: Parameters<MediaObjectStore['put']>[0]) => {
      storedKey = input.key;
      return { objectUri: 'r2://arena-media/object', cdnUrl: 'https://media.arenaprops.com/object.png' };
    });
    const upsert = vi.fn(async () => undefined);
    const result = await importMediaCandidate(approvedCandidate(), {
      fetcher: vi.fn(async () => new Response(png, { status: 200, headers: { 'content-type': 'image/png' } })) as typeof fetch,
      objectStore: { put },
      catalog: { upsert },
      now: () => new Date('2026-09-03T12:00:00.000Z'),
    });

    expect(put).toHaveBeenCalledWith(expect.objectContaining({ visibility: 'public', contentType: 'image/png' }));
    expect(storedKey).toMatch(/^media\/player\/player_1\/player_headshot\/[a-f0-9]{64}\.png$/);
    expect(toPublicMediaAsset(result)?.url).toBe('https://media.arenaprops.com/object.png');
    expect(toPublicMediaAsset(result)).toMatchObject({ width: 40, height: 40 });
    expect(upsert).toHaveBeenCalledWith(result);
  });

  it('keeps pending-rights imports private and out of public read models', async () => {
    const put = vi.fn(async () => ({ objectUri: 'r2://arena-media/private-object', cdnUrl: 'https://media.arenaprops.com/private-object.png' }));
    const result = await importMediaCandidate(approvedCandidate({ rightsStatus: 'pending' }), {
      fetcher: vi.fn(async () => new Response(png, { status: 200, headers: { 'content-type': 'image/png' } })) as typeof fetch,
      objectStore: { put },
      catalog: { upsert: vi.fn(async () => undefined) },
    });

    expect(put).toHaveBeenCalledWith(expect.objectContaining({ visibility: 'private' }));
    expect(result.cdnUrl).toBeNull();
    expect(toPublicMediaAsset(result)).toBeNull();
  });

  it('rejects untrusted source hosts before making a request', async () => {
    const fetcher = vi.fn();
    await expect(importMediaCandidate(approvedCandidate({ sourceUrl: 'https://example.com/logo.png' }), {
      fetcher: fetcher as typeof fetch,
      objectStore: { put: vi.fn() },
      catalog: { upsert: vi.fn() },
    })).rejects.toThrow('media_source_host_not_allowed');
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('rejects bytes that are not a supported raster image', async () => {
    await expect(importMediaCandidate(approvedCandidate(), {
      fetcher: vi.fn(async () => new Response('not an image', { status: 200, headers: { 'content-type': 'text/plain' } })) as typeof fetch,
      objectStore: { put: vi.fn() },
      catalog: { upsert: vi.fn() },
    })).rejects.toThrow('media_content_type_not_allowed');
  });
});
