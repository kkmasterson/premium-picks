import { expect, it } from 'vitest';
import { buildApi } from './app';
it('returns explicit unavailable feeds without fixtures and rejects malformed event identifiers', async () => {
  const app = await buildApi();
  try {
    for (const url of ['/api/v1/nba/directory', '/api/v1/nba/odds']) {
      const result = await app.inject(url);
      expect(result.statusCode).toBe(200);
      expect(result.json()).toEqual({ data: null, freshness: 'unavailable' });
    }
    expect((await app.inject('/api/v1/nba/odds?eventId=bad')).statusCode).toBe(400);
  } finally { await app.close(); }
});
