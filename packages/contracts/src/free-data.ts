import { z } from 'zod';

export const DirectoryTeamSchema = z.object({ id: z.string().uuid(), name: z.string(), abbreviation: z.string(), conference: z.string(), division: z.string(), city: z.string(), image: z.string().url().nullable(), venue: z.string().nullable() });
export const DirectoryPlayerSchema = z.object({ id: z.string().uuid(), name: z.string(), teamId: z.string().uuid().nullable(), position: z.string(), height: z.string().nullable(), country: z.string().nullable(), image: z.string().url().nullable() });
export const DirectorySchema = z.object({ observedAt: z.string().datetime(), complete: z.boolean(), teams: z.array(DirectoryTeamSchema), players: z.array(DirectoryPlayerSchema), leagueImage: z.string().url().nullable() });
export const QuoteSchema = z.object({ book: z.string(), market: z.string(), subject: z.string(), side: z.string(), line: z.number().nullable(), decimal: z.number().gt(1), updatedAt: z.string().datetime({ offset: true }), implied: z.number(), noVig: z.number().nullable(), best: z.boolean(), consensus: z.number().nullable(), disagreement: z.number().nullable() });
export const OddsSnapshotSchema = z.object({ eventId: z.string().uuid(), observedAt: z.string().datetime(), quotes: z.array(QuoteSchema), markets: z.array(z.string()), creditsRemaining: z.number().nullable() });
export const AlertSchema = z.object({ id: z.string(), observedAt: z.string().datetime(), kind: z.enum(['line_changed', 'new_best_price', 'market_removed']), description: z.string() });
export const OddsViewSchema = z.object({ current: OddsSnapshotSchema.nullable(), history: z.array(OddsSnapshotSchema), alerts: z.array(AlertSchema) });
export const FreshnessSchema = z.enum(['fresh', 'stale', 'unavailable']);
export const DirectoryResponseSchema = z.object({ data: DirectorySchema.nullable(), freshness: FreshnessSchema });
export const OddsResponseSchema = z.object({ data: OddsViewSchema.nullable(), freshness: FreshnessSchema });
export type Directory = z.infer<typeof DirectorySchema>;
export type Quote = z.infer<typeof QuoteSchema>;
export type OddsSnapshot = z.infer<typeof OddsSnapshotSchema>;
export type OddsView = z.infer<typeof OddsViewSchema>;
