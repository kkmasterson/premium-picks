import { createHash } from 'node:crypto';
import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';
import compress from '@fastify/compress';
import cors from '@fastify/cors';
import type { AccessTier } from '@arena/contracts';
import { PROP_BOARD_ROWS } from '../../src/features/dashboard/props-fixtures.js';
import { serializePropForTier } from './entitlements.js';
import type { ScheduleResponse } from '../../packages/contracts/src/schedule.js';
import { scheduleResponse } from './schedule.js';
import { freeDataReaders } from './free-data.js';

function tierFor(request: FastifyRequest): AccessTier {
  // Internal proof only. Replace this header with verified Clerk JWT claims before production.
  return request.headers['x-arena-demo-tier'] === 'tier2' ? 'tier2' : 'tier1';
}

function etag(value: unknown) { return `"${createHash('sha256').update(JSON.stringify(value)).digest('base64url').slice(0, 24)}"`; }
function sendCached(request: FastifyRequest, reply: FastifyReply, payload: unknown) {
  const tag = etag(payload);
  reply.header('etag', tag).header('cache-control', 'private, max-age=30, stale-while-revalidate=30').header('x-arena-freshness', 'fixture');
  if (request.headers['if-none-match'] === tag) return reply.code(304).send();
  return reply.send(payload);
}

export async function buildApi(options: { readSchedule?: () => Promise<ScheduleResponse>; freeData?: ReturnType<typeof freeDataReaders> } = {}) {
  const app = Fastify({ logger: process.env.NODE_ENV !== 'test' });
  await app.register(compress, { global: true });
  await app.register(cors, { origin: process.env.ARENA_WEB_ORIGIN ?? false });
  app.get('/health', async () => ({ ok: true, service: 'arena-props-api' }));
  const freeData = options.freeData ?? freeDataReaders(null);
  app.get('/api/v1/nba/directory', async (_request, reply) => {
    reply.header('cache-control', 'private, max-age=30');
    return freeData.directory();
  });
  app.get<{ Querystring: { eventId?: string } }>('/api/v1/nba/odds', async (request, reply) => {
    if (request.query.eventId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(request.query.eventId)) return reply.code(400).send({ error: 'invalid_event' });
    reply.header('cache-control', 'private, no-cache');
    return freeData.odds(request.query.eventId);
  });
  app.get('/api/v1/nba/schedule', async (request, reply) => {
    const payload = options.readSchedule ? await options.readSchedule() : scheduleResponse(null);
    const tag = etag(payload);
    reply.header('etag', tag).header('cache-control', 'private, no-cache').header('x-arena-freshness', payload.meta.freshness);
    if (request.headers['if-none-match'] === tag) return reply.code(304).send();
    return reply.send(payload);
  });
  app.get('/api/v1/reference', async (request, reply) => sendCached(request, reply, { lineTypes: ['regular', 'goblin', 'devil', 'alternate'], eventPhases: ['pregame', 'live', 'final'], offerStatuses: ['active', 'suspended', 'stale', 'closed'], competitions: [{ id: 'nba', name: 'NBA', proofStatus: 'fixture' }] }));
  app.get('/api/v1/props', async (request, reply) => sendCached(request, reply, { data: PROP_BOARD_ROWS.map((row) => serializePropForTier(row, tierFor(request))), meta: { source: 'internal-fixture', live: false, polledAfterSeconds: 45 } }));
  app.get<{ Params: { propId: string } }>('/api/v1/props/:propId', async (request, reply) => { const row = PROP_BOARD_ROWS.find((candidate) => candidate.id === request.params.propId); if (!row) return reply.code(404).send({ error: 'prop_not_found' }); return sendCached(request, reply, { data: serializePropForTier(row, tierFor(request)), meta: { source: 'internal-fixture', live: false } }); });
  app.get<{ Params: { playerId: string } }>('/api/v1/players/:playerId/research', async (request, reply) => { const rows = PROP_BOARD_ROWS.filter((row) => row.playerId === request.params.playerId).map((row) => serializePropForTier(row, tierFor(request))); if (!rows.length) return reply.code(404).send({ error: 'player_not_found' }); return sendCached(request, reply, { data: { playerId: request.params.playerId, props: rows }, meta: { source: 'internal-fixture', live: false } }); });
  return app;
}
