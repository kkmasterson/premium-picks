import { z } from 'zod';

export const SCHEDULE_IMPORT_SECONDS = 7 * 86_400;
export const SCHEDULE_STALE_SECONDS = 8 * 86_400;

export const GameStateSchema = z.enum(['scheduled', 'in_progress', 'final', 'postponed', 'canceled', 'delayed', 'suspended', 'abandoned', 'unknown']);
export const ScheduleTeamSchema = z.object({ id: z.string().uuid(), name: z.string(), abbreviation: z.string() });
export const ScheduleGameSchema = z.object({
  id: z.string().uuid(), competition: z.literal('nba'), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startsAt: z.string().datetime({ offset: true }).nullable(), state: GameStateSchema,
  home: ScheduleTeamSchema, away: ScheduleTeamSchema,
  homeScore: z.number().int().nonnegative().nullable(), awayScore: z.number().int().nonnegative().nullable(),
  period: z.number().int().nonnegative(), clock: z.string().nullable(),
  postseason: z.boolean().nullable().optional(),
  observedAt: z.string().datetime().optional(),
});
export const ScheduleSnapshotSchema = z.object({
  games: z.array(ScheduleGameSchema), windowStart: z.string(), windowEnd: z.string(),
  observedAt: z.string().datetime(), generation: z.string().uuid(),
});
export const ScheduleResponseSchema = z.object({
  data: ScheduleSnapshotSchema.nullable(),
  meta: z.object({
    source: z.literal('arena-ingestion'), freshness: z.enum(['fresh', 'stale', 'unavailable']),
    importIntervalSeconds: z.literal(SCHEDULE_IMPORT_SECONDS), staleAfterSeconds: z.literal(SCHEDULE_STALE_SECONDS), automaticRefresh: z.literal(false),
    capabilities: z.object({ playerStats: z.literal(false), playerProps: z.literal(false) }),
  }),
});
export type ScheduleGame = z.infer<typeof ScheduleGameSchema>;
export type ScheduleSnapshot = z.infer<typeof ScheduleSnapshotSchema>;
export type ScheduleResponse = z.infer<typeof ScheduleResponseSchema>;
