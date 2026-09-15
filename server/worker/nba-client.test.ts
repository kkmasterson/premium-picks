// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { NbaClient, NbaGameSchema, gameState } from './nba-client';

const game = { id: 90, date: '2026-09-09', datetime: '2026-09-09T23:00:00Z', status: '7:00 pm ET', period: 0, time: '', home_team_score: 0, visitor_team_score: 0, home_team: { id: 1, full_name: 'Home', abbreviation: 'HOM' }, visitor_team: { id: 2, full_name: 'Away', abbreviation: 'AWY' } };
const response = (data: unknown, next: number | null = null) => new Response(JSON.stringify({ data, meta: { next_cursor: next } }));

describe('NBA provider boundary', () => {
  it('collects all pages and preseason without duplicating games', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(response([game], 100)).mockResolvedValueOnce(response([{ ...game, id: 91 }])).mockResolvedValueOnce(response([game]));
    const result = await new NbaClient('test-secret', fetcher, 0).games('2026-09-01', '2026-10-01');
    expect(result.map((row) => row.id)).toEqual([90, 91]);
    expect(String(fetcher.mock.calls[1][0])).toContain('cursor=100');
    expect(String(fetcher.mock.calls[2][0])).toContain('season_type=preseason');
    expect(String(fetcher.mock.calls[0][0])).not.toContain('test-secret');
  });
  it('rejects schema drift and repeating pagination', async () => {
    await expect(new NbaClient('test', vi.fn().mockResolvedValue(response([{ ...game, home_team: null }])), 0).games('2026-09-01', '2026-10-01')).rejects.toThrow('nba_schema_mismatch');
    await expect(new NbaClient('test', vi.fn().mockImplementation(async () => response([game], 100)), 0).games('2026-09-01', '2026-10-01')).rejects.toThrow('nba_cursor_repeated');
  });
  it('redacts network failures and does not retry 429', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response('', { status: 429 }));
    await expect(new NbaClient('secret', fetcher, 0).games('2026-09-01', '2026-10-01')).rejects.toThrow('nba_http_429');
    expect(fetcher).toHaveBeenCalledTimes(1);
    await expect(new NbaClient('secret', vi.fn().mockRejectedValue(new Error('secret')), 0).games('2026-09-01', '2026-10-01')).rejects.toThrow('nba_network_error');
  });
  it('honors final and disrupted game states', () => {
    expect(gameState(NbaGameSchema.parse({ ...game, period: 4, status: 'Final' }))).toBe('final');
    expect(gameState(NbaGameSchema.parse({ ...game, postponed: true }))).toBe('postponed');
    expect(gameState(NbaGameSchema.parse({ ...game, status_state: 'delayed', period: 2 }))).toBe('delayed');
    expect(gameState(NbaGameSchema.parse({ ...game, datetime: null }))).toBe('unknown');
  });
});
