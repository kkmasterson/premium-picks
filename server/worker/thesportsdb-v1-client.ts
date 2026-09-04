import { z } from 'zod';
import {
  TheSportsDbPlayerMediaSchema,
  TheSportsDbSportMediaSchema,
  TheSportsDbTeamMediaSchema,
} from './media-ingestion.js';

const playerLookupResponse = z.object({
  players: z.array(TheSportsDbPlayerMediaSchema).nullable(),
});

const teamLookupResponse = z.object({
  teams: z.array(TheSportsDbTeamMediaSchema).nullable(),
});

const sportsResponse = z.object({
  sports: z.array(TheSportsDbSportMediaSchema),
});

const providerId = z.string().regex(/^\d+$/);
const freeApiKey = z.string().regex(/^\d+$/);

export interface TheSportsDbV1ClientOptions {
  fetcher?: typeof fetch;
  apiKey?: string;
  baseUrl?: string;
}

/**
 * Development/mockup client for TheSportsDB V1. The published free key is 123.
 * Keep this server-side even though the key is public so provider URLs and
 * response shapes never become frontend contracts.
 */
export class TheSportsDbV1Client {
  private readonly fetcher: typeof fetch;
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(options: TheSportsDbV1ClientOptions = {}) {
    this.fetcher = options.fetcher ?? fetch;
    this.apiKey = freeApiKey.parse(options.apiKey ?? '123');
    this.baseUrl = options.baseUrl ?? 'https://www.thesportsdb.com/api/v1/json';
  }

  private async request<T>(path: string, query: Record<string, string>, schema: z.ZodType<T>): Promise<T> {
    const url = new URL(`${this.baseUrl}/${this.apiKey}/${path}`);
    for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);

    const response = await this.fetcher(url, {
      headers: { accept: 'application/json' },
      redirect: 'error',
    });
    if (response.status === 429) throw new Error('thesportsdb_free_rate_limit');
    if (!response.ok) throw new Error(`thesportsdb_v1_request_failed:${response.status}`);
    return schema.parse(await response.json());
  }

  async lookupPlayer(id: string) {
    const result = await this.request('lookupplayer.php', { id: providerId.parse(id) }, playerLookupResponse);
    return result.players?.[0] ?? null;
  }

  async lookupTeam(id: string) {
    const result = await this.request('lookupteam.php', { id: providerId.parse(id) }, teamLookupResponse);
    return result.teams?.[0] ?? null;
  }

  async listSports() {
    const result = await this.request('all_sports.php', {}, sportsResponse);
    return result.sports;
  }
}
