import { z } from 'zod';
export * from './schedule';

export const LineTypeSchema = z.enum(['regular', 'goblin', 'devil', 'alternate']);
export const AccessTierSchema = z.enum(['tier1', 'tier2']);
export const EventPhaseSchema = z.enum(['pregame', 'live', 'final']);
export const OfferStatusSchema = z.enum(['active', 'suspended', 'stale', 'closed']);
export const SideSchema = z.enum(['over', 'under']);
export const MediaAssetKindSchema = z.enum(['player_headshot', 'team_badge', 'team_logo', 'sport_icon']);
export const MediaVariantSchema = z.enum(['default', 'square', 'transparent', 'original']);

export const PublicMediaAssetSchema = z.object({
  url: z.string().url(),
  kind: MediaAssetKindSchema,
  variant: MediaVariantSchema,
  alt: z.string(),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  revision: z.string(),
  attribution: z.object({
    text: z.string(),
    url: z.string().url().nullable(),
  }).nullable(),
});

export const HitRateSchema = z.object({
  hits: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  pct: z.number().min(0).max(100),
});

export const ConfidenceComponentSchema = z.object({
  label: z.string(),
  score: z.number().min(0).max(100),
  contribution: z.number().min(0).max(100),
});

export const ConfidenceSchema = z.object({
  score: z.number().int().min(0).max(100),
  grade: z.enum(['Low', 'Moderate', 'Strong', 'High']),
  version: z.string(),
  calculatedAt: z.string().datetime(),
  demo: z.boolean(),
  components: z.array(ConfidenceComponentSchema),
});

export const EvDetailsSchema = z.object({
  evPercent: z.number(),
  impliedProbability: z.number().min(0).max(1),
  fairProbability: z.number().min(0).max(1),
  fairOdds: z.number(),
  edge: z.number(),
  modelVersion: z.string(),
  inputCutoff: z.string().datetime(),
  demo: z.boolean(),
});

export const EvAccessSchema = z.object({
  positiveEvDetected: z.boolean(),
  details: EvDetailsSchema.nullable(),
});

export const PropOfferSchema = z.object({
  id: z.string(),
  providerId: z.string(),
  providerName: z.string(),
  providerShortName: z.string(),
  lineType: LineTypeSchema,
  line: z.number(),
  overOdds: z.number().nullable(),
  underOdds: z.number().nullable(),
  payoutMultiplier: z.number().positive().nullable(),
  status: OfferStatusSchema,
  observedAt: z.string().datetime(),
  ev: z.object({ over: EvAccessSchema, under: EvAccessSchema }),
});

export const SideMetricsSchema = z.object({
  average: z.number(),
  projection: z.number().nullable(),
  edge: z.number().nullable(),
  l5: HitRateSchema,
  l10: HitRateSchema,
  l15: HitRateSchema,
  season: HitRateSchema,
  h2h: HitRateSchema,
  streak: z.object({ side: SideSchema, count: z.number().int().nonnegative() }),
  confidence: ConfidenceSchema.nullable(),
});

export const PropLineMetricsSchema = z.object({
  line: z.number(),
  over: SideMetricsSchema,
  under: SideMetricsSchema,
});

export const MoneylineOfferSchema = z.object({
  providerId: z.string(),
  providerShortName: z.string(),
  playerTeamOdds: z.number().nullable(),
  opponentOdds: z.number().nullable(),
  status: OfferStatusSchema,
  observedAt: z.string().datetime(),
});

export const LineMovementPointSchema = z.object({
  providerId: z.string(),
  observedAt: z.string().datetime(),
  line: z.number(),
  direction: z.enum(['up', 'down', 'flat']),
});

export const PropBoardRowSchema = z.object({
  id: z.string(),
  playerId: z.string(),
  playerName: z.string(),
  headshotUrl: z.string().url().nullable(),
  team: z.string(),
  position: z.string(),
  opponent: z.string(),
  sport: z.string(),
  market: z.string(),
  event: z.object({
    id: z.string(),
    phase: EventPhaseSchema,
    startTimeLabel: z.string(),
    statusLabel: z.string(),
  }),
  offers: z.array(PropOfferSchema).min(1),
  defaultOfferId: z.string(),
  metricsByLine: z.array(PropLineMetricsSchema).min(1),
  moneylines: z.array(MoneylineOfferSchema),
  lineMovement: z.array(LineMovementPointSchema),
});

export const BuilderSelectionSchema = z.object({
  key: z.string(),
  propId: z.string(),
  offerId: z.string(),
  side: SideSchema,
  providerId: z.string(),
  providerName: z.string(),
  providerShortName: z.string(),
  lineType: LineTypeSchema,
  capturedLine: z.number(),
  capturedOdds: z.number().nullable(),
  payoutMultiplier: z.number().positive().nullable(),
  capturedAt: z.string().datetime(),
});

export const PopularityActionSchema = z.enum(['builder_add', 'save', 'side_selection', 'view']);
export const PopularityEventSchema = z.object({
  id: z.string(),
  propId: z.string(),
  actorId: z.string(),
  action: PopularityActionSchema,
  side: SideSchema.nullable(),
  occurredAt: z.string().datetime(),
});

export const BonusOfferSchema = z.object({
  id: z.string(),
  partnerName: z.string(),
  offerSummary: z.string(),
  promoCode: z.string().nullable(),
  eligibility: z.string(),
  expiresAt: z.string().datetime().nullable(),
  termsUrl: z.string().url().nullable(),
  claimUrl: z.string().url().nullable(),
  disclosure: z.string(),
  active: z.boolean(),
});

export type LineType = z.infer<typeof LineTypeSchema>;
export type AccessTier = z.infer<typeof AccessTierSchema>;
export type EventPhase = z.infer<typeof EventPhaseSchema>;
export type OfferStatus = z.infer<typeof OfferStatusSchema>;
export type Side = z.infer<typeof SideSchema>;
export type MediaAssetKind = z.infer<typeof MediaAssetKindSchema>;
export type MediaVariant = z.infer<typeof MediaVariantSchema>;
export type PublicMediaAsset = z.infer<typeof PublicMediaAssetSchema>;
export type HitRate = z.infer<typeof HitRateSchema>;
export type Confidence = z.infer<typeof ConfidenceSchema>;
export type EvAccess = z.infer<typeof EvAccessSchema>;
export type PropOffer = z.infer<typeof PropOfferSchema>;
export type SideMetrics = z.infer<typeof SideMetricsSchema>;
export type PropLineMetrics = z.infer<typeof PropLineMetricsSchema>;
export type MoneylineOffer = z.infer<typeof MoneylineOfferSchema>;
export type LineMovementPoint = z.infer<typeof LineMovementPointSchema>;
export type PropBoardRow = z.infer<typeof PropBoardRowSchema>;
export type BuilderSelection = z.infer<typeof BuilderSelectionSchema>;
export type PopularityAction = z.infer<typeof PopularityActionSchema>;
export type PopularityEvent = z.infer<typeof PopularityEventSchema>;
export type BonusOffer = z.infer<typeof BonusOfferSchema>;
