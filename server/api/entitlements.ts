import type { AccessTier, PropBoardRow } from '@arena/contracts';

export function serializePropForTier(row: PropBoardRow, tier: AccessTier): PropBoardRow {
  if (tier === 'tier2') return row;
  return {
    ...row,
    offers: row.offers.map((offer) => ({
      ...offer,
      ev: {
        over: { positiveEvDetected: offer.ev.over.positiveEvDetected, details: null },
        under: { positiveEvDetected: offer.ev.under.positiveEvDetected, details: null },
      },
    })),
  };
}
