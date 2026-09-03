import { afterEach, describe, expect, it } from 'vitest';
import { buildApi } from './app';

const apps: Awaited<ReturnType<typeof buildApi>>[] = [];
afterEach(async () => { await Promise.all(apps.splice(0).map((app) => app.close())); });

describe('Arena Props API contract', () => {
  it('redacts EV details for Tier 1 and exposes them for Tier 2', async () => {
    const app = await buildApi(); apps.push(app);
    const tier1 = await app.inject({ url: '/api/v1/props' });
    const tier2 = await app.inject({ url: '/api/v1/props', headers: { 'x-arena-demo-tier': 'tier2' } });
    const tier1Payload = tier1.json(); const tier2Payload = tier2.json();
    expect(tier1Payload.data.every((row: { offers: Array<{ ev: { over: { details: unknown }; under: { details: unknown } } }> }) => row.offers.every((offer) => offer.ev.over.details === null && offer.ev.under.details === null))).toBe(true);
    expect(tier2Payload.data.some((row: { offers: Array<{ ev: { over: { details: unknown } } }> }) => row.offers.some((offer) => offer.ev.over.details !== null))).toBe(true);
  });
  it('supports ETag revalidation', async () => {
    const app = await buildApi(); apps.push(app);
    const first = await app.inject({ url: '/api/v1/reference' });
    expect(first.headers.etag).toBeTruthy();
    const second = await app.inject({ url: '/api/v1/reference', headers: { 'if-none-match': first.headers.etag! } });
    expect(second.statusCode).toBe(304);
  });
});
