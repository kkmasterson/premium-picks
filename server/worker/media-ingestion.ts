import { createHash } from 'node:crypto';
import { z } from 'zod';
import { MediaAssetKindSchema, MediaVariantSchema, type PublicMediaAsset } from '@arena/contracts';

const nullableUrl = z.union([z.string().url(), z.literal(''), z.null()]).optional();
const ownerKey = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);

export const MediaOwnerTypeSchema = z.enum(['player', 'team', 'sport']);
export const MediaRightsStatusSchema = z.enum(['pending', 'approved', 'restricted', 'expired']);
export const MediaTransformPolicySchema = z.enum(['as_is', 'proportional_resize']);

export const MediaCandidateSchema = z.object({
  ownerType: MediaOwnerTypeSchema,
  ownerKey,
  kind: MediaAssetKindSchema,
  variant: MediaVariantSchema,
  sourceProvider: z.string().min(1),
  sourceEntityId: z.string().min(1),
  sourceUrl: z.string().url(),
  alt: z.string().min(1),
  priority: z.number().int().nonnegative(),
  rightsStatus: MediaRightsStatusSchema,
  rightsReference: z.string().url().nullable(),
  attributionText: z.string().nullable(),
  attributionUrl: z.string().url().nullable(),
  licenseTag: z.string().nullable(),
  transformPolicy: MediaTransformPolicySchema,
});

export type MediaCandidate = z.infer<typeof MediaCandidateSchema>;
export type MediaRightsStatus = z.infer<typeof MediaRightsStatusSchema>;

export interface StoredMediaObject {
  objectUri: string;
  cdnUrl: string | null;
}

export interface MediaObjectStore {
  put(input: {
    key: string;
    bytes: Uint8Array;
    contentType: 'image/jpeg' | 'image/png' | 'image/webp';
    visibility: 'private' | 'public';
  }): Promise<StoredMediaObject>;
}

export interface ImportedMediaAsset extends MediaCandidate {
  objectUri: string;
  cdnUrl: string | null;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  byteSize: number;
  width: number | null;
  height: number | null;
  sha256: string;
  revision: string;
  importedAt: string;
}

export interface MediaCatalog {
  upsert(asset: ImportedMediaAsset): Promise<void>;
}

export interface MediaImportDependencies {
  fetcher: typeof fetch;
  objectStore: MediaObjectStore;
  catalog: MediaCatalog;
  allowedSourceHosts?: ReadonlySet<string>;
  maxBytes?: number;
  now?: () => Date;
}

export const TheSportsDbPlayerMediaSchema = z.object({
  idPlayer: z.string().min(1),
  strPlayer: z.string().min(1),
  strThumb: nullableUrl,
  strCutout: nullableUrl,
  strCreativeCommons: z.string().nullish(),
}).passthrough();

export const TheSportsDbTeamMediaSchema = z.object({
  idTeam: z.string().min(1),
  strTeam: z.string().min(1),
  strBadge: nullableUrl,
  strLogo: nullableUrl,
}).passthrough();

export const TheSportsDbSportMediaSchema = z.object({
  idSport: z.string().min(1),
  strSport: z.string().min(1),
  strSportIconGreen: nullableUrl,
}).passthrough();

const THE_SPORTS_DB_TERMS = 'https://www.thesportsdb.com/docs_terms_of_use.php';
const THE_SPORTS_DB_ATTRIBUTION = 'Media sourced from TheSportsDB';

function candidate(input: Omit<MediaCandidate, 'sourceProvider' | 'rightsStatus' | 'rightsReference' | 'attributionText' | 'attributionUrl'>): MediaCandidate {
  return MediaCandidateSchema.parse({
    ...input,
    sourceProvider: 'thesportsdb',
    // Provider payloads never approve themselves. A separate rights review must
    // promote the asset before a public CDN URL can be emitted.
    rightsStatus: 'pending',
    rightsReference: THE_SPORTS_DB_TERMS,
    attributionText: THE_SPORTS_DB_ATTRIBUTION,
    attributionUrl: 'https://www.thesportsdb.com',
  });
}

function present(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.length > 0;
}

export function mapTheSportsDbPlayerMedia(raw: unknown, canonicalPlayerId: string): MediaCandidate[] {
  const player = TheSportsDbPlayerMediaSchema.parse(raw);
  const items: MediaCandidate[] = [];

  if (present(player.strThumb)) {
    items.push(candidate({
      ownerType: 'player', ownerKey: canonicalPlayerId, kind: 'player_headshot', variant: 'square',
      sourceEntityId: player.idPlayer, sourceUrl: player.strThumb, alt: player.strPlayer,
      priority: 0, licenseTag: player.strCreativeCommons ?? null, transformPolicy: 'proportional_resize',
    }));
  }
  if (present(player.strCutout)) {
    items.push(candidate({
      ownerType: 'player', ownerKey: canonicalPlayerId, kind: 'player_headshot', variant: 'transparent',
      sourceEntityId: player.idPlayer, sourceUrl: player.strCutout, alt: player.strPlayer,
      priority: 1, licenseTag: player.strCreativeCommons ?? null, transformPolicy: 'proportional_resize',
    }));
  }

  return items;
}

export function mapTheSportsDbTeamMedia(raw: unknown, canonicalTeamId: string): MediaCandidate[] {
  const team = TheSportsDbTeamMediaSchema.parse(raw);
  const items: MediaCandidate[] = [];

  if (present(team.strBadge)) {
    items.push(candidate({
      ownerType: 'team', ownerKey: canonicalTeamId, kind: 'team_badge', variant: 'square',
      sourceEntityId: team.idTeam, sourceUrl: team.strBadge, alt: `${team.strTeam} badge`,
      priority: 0, licenseTag: 'trademarked-team-mark', transformPolicy: 'as_is',
    }));
  }
  if (present(team.strLogo)) {
    items.push(candidate({
      ownerType: 'team', ownerKey: canonicalTeamId, kind: 'team_logo', variant: 'transparent',
      sourceEntityId: team.idTeam, sourceUrl: team.strLogo, alt: `${team.strTeam} logo`,
      priority: 1, licenseTag: 'trademarked-team-mark', transformPolicy: 'as_is',
    }));
  }

  return items;
}

export function mapTheSportsDbSportMedia(raw: unknown, canonicalSportKey: string): MediaCandidate[] {
  const sport = TheSportsDbSportMediaSchema.parse(raw);
  if (!present(sport.strSportIconGreen)) return [];

  return [candidate({
    ownerType: 'sport', ownerKey: canonicalSportKey, kind: 'sport_icon', variant: 'transparent',
    sourceEntityId: sport.idSport, sourceUrl: sport.strSportIconGreen, alt: `${sport.strSport} icon`,
    priority: 0, licenseTag: 'provider-custom-artwork', transformPolicy: 'proportional_resize',
  })];
}

function sourceUrl(candidateValue: MediaCandidate, allowedHosts: ReadonlySet<string>): URL {
  const url = new URL(candidateValue.sourceUrl);
  if (url.protocol !== 'https:') throw new Error('media_source_must_use_https');
  if (url.username || url.password || url.port) throw new Error('media_source_url_not_allowed');
  if (!allowedHosts.has(url.hostname.toLowerCase())) throw new Error('media_source_host_not_allowed');
  return url;
}

function sniffMime(bytes: Uint8Array): ImportedMediaAsset['mimeType'] | null {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) return 'image/png';
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP') return 'image/webp';
  return null;
}

function readDimensions(bytes: Uint8Array, mimeType: ImportedMediaAsset['mimeType']): { width: number | null; height: number | null } {
  if (mimeType === 'image/png' && bytes.length >= 24) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return { width: view.getUint32(16), height: view.getUint32(20) };
  }

  if (mimeType === 'image/jpeg') {
    let offset = 2;
    while (offset + 8 < bytes.length) {
      if (bytes[offset] !== 0xff) break;
      const marker = bytes[offset + 1];
      if (marker === undefined) break;
      if (marker === 0xd8 || marker === 0xd9) {
        offset += 2;
        continue;
      }
      const length = (bytes[offset + 2] ?? 0) * 256 + (bytes[offset + 3] ?? 0);
      if (length < 2 || offset + length + 2 > bytes.length) break;
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return {
          height: (bytes[offset + 5] ?? 0) * 256 + (bytes[offset + 6] ?? 0),
          width: (bytes[offset + 7] ?? 0) * 256 + (bytes[offset + 8] ?? 0),
        };
      }
      offset += length + 2;
    }
  }

  if (mimeType === 'image/webp' && bytes.length >= 30 && String.fromCharCode(...bytes.slice(12, 16)) === 'VP8X') {
    const width = 1 + (bytes[24] ?? 0) + ((bytes[25] ?? 0) << 8) + ((bytes[26] ?? 0) << 16);
    const height = 1 + (bytes[27] ?? 0) + ((bytes[28] ?? 0) << 8) + ((bytes[29] ?? 0) << 16);
    return { width, height };
  }

  return { width: null, height: null };
}

async function readLimitedBody(response: Response, maxBytes: number): Promise<Uint8Array> {
  const statedLength = Number(response.headers.get('content-length'));
  if (Number.isFinite(statedLength) && statedLength > maxBytes) throw new Error('media_file_too_large');
  if (!response.body) throw new Error('media_response_has_no_body');

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error('media_file_too_large');
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

function extensionFor(mimeType: ImportedMediaAsset['mimeType']): string {
  if (mimeType === 'image/jpeg') return 'jpg';
  if (mimeType === 'image/png') return 'png';
  return 'webp';
}

export async function importMediaCandidate(raw: unknown, dependencies: MediaImportDependencies): Promise<ImportedMediaAsset> {
  const parsed = MediaCandidateSchema.parse(raw);
  const allowedHosts = dependencies.allowedSourceHosts ?? new Set(['r2.thesportsdb.com', 'www.thesportsdb.com']);
  const url = sourceUrl(parsed, allowedHosts);
  const maxBytes = dependencies.maxBytes ?? 5 * 1024 * 1024;
  const response = await dependencies.fetcher(url, { redirect: 'error' });
  if (!response.ok) throw new Error(`media_fetch_failed:${response.status}`);

  const bytes = await readLimitedBody(response, maxBytes);
  const mimeType = sniffMime(bytes);
  if (!mimeType) throw new Error('media_content_type_not_allowed');

  const headerMime = response.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
  if (headerMime && headerMime !== mimeType && !(headerMime === 'image/jpg' && mimeType === 'image/jpeg')) {
    throw new Error('media_content_type_mismatch');
  }

  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const dimensions = readDimensions(bytes, mimeType);
  const revision = sha256.slice(0, 16);
  const key = `media/${parsed.ownerType}/${parsed.ownerKey}/${parsed.kind}/${sha256}.${extensionFor(mimeType)}`;
  const visibility = parsed.rightsStatus === 'approved' ? 'public' : 'private';
  const stored = await dependencies.objectStore.put({ key, bytes, contentType: mimeType, visibility });
  const imported: ImportedMediaAsset = {
    ...parsed,
    objectUri: stored.objectUri,
    cdnUrl: parsed.rightsStatus === 'approved' ? stored.cdnUrl : null,
    mimeType,
    byteSize: bytes.byteLength,
    width: dimensions.width,
    height: dimensions.height,
    sha256,
    revision,
    importedAt: (dependencies.now ?? (() => new Date()))().toISOString(),
  };
  await dependencies.catalog.upsert(imported);
  return imported;
}

export function toPublicMediaAsset(asset: ImportedMediaAsset): PublicMediaAsset | null {
  if (asset.rightsStatus !== 'approved' || !asset.cdnUrl) return null;
  return {
    url: asset.cdnUrl,
    kind: asset.kind,
    variant: asset.variant,
    alt: asset.alt,
    width: asset.width,
    height: asset.height,
    revision: asset.revision,
    attribution: asset.attributionText ? { text: asset.attributionText, url: asset.attributionUrl } : null,
  };
}
