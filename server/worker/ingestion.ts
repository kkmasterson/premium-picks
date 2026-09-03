import { createHash } from 'node:crypto';
import { z } from 'zod';

export interface RawArchive { put(key: string, payload: string): Promise<void>; }
export interface CanonicalWriter { hasDelivery(id: string): Promise<boolean>; publish(batch: CanonicalBatch): Promise<void>; quarantine(record: QuarantineRecord): Promise<void>; }
export interface CanonicalBatch { deliveryId: string; provider: string; observedAt: string; players: unknown[]; events: unknown[]; offers: unknown[]; }
export interface QuarantineRecord { deliveryId: string; provider: string; reason: string; payloadHash: string; observedAt: string; }
export interface ProviderAdapter<T> { provider: string; schemaVersion: string; input: z.ZodType<T>; map(value: T, context: { deliveryId: string; observedAt: string }): CanonicalBatch; }

export async function ingestDelivery<T>(raw: unknown, adapter: ProviderAdapter<T>, archive: RawArchive, writer: CanonicalWriter, observedAt = new Date().toISOString()) {
  const encoded = JSON.stringify(raw);
  const hash = createHash('sha256').update(encoded).digest('hex');
  const deliveryId = `${adapter.provider}:${adapter.schemaVersion}:${hash}`;
  await archive.put(`${adapter.provider}/${observedAt.slice(0, 10)}/${deliveryId}.json`, encoded);
  if (await writer.hasDelivery(deliveryId)) return { status: 'duplicate' as const, deliveryId };
  const parsed = adapter.input.safeParse(raw);
  if (!parsed.success) {
    await writer.quarantine({ deliveryId, provider: adapter.provider, reason: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; '), payloadHash: hash, observedAt });
    return { status: 'quarantined' as const, deliveryId };
  }
  const batch = adapter.map(parsed.data, { deliveryId, observedAt });
  await writer.publish(batch);
  return { status: 'published' as const, deliveryId };
}
