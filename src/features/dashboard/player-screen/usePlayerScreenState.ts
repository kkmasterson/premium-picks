import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import type { MarketSnapshot, PlayerResearchViewModel, PlayerRouteSelection } from './types';

function normalizedLine(raw: string | null, market: MarketSnapshot): number {
  const parsed = Number(raw);
  if (!raw || !Number.isFinite(parsed) || parsed < 0) return market.canonicalLine;
  const step = market.definition.step || 0.5;
  return Math.round(parsed / step) * step;
}

export function usePlayerScreenState(viewModel: PlayerResearchViewModel) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPeriod = viewModel.profile.periods.find((period) => period.key === searchParams.get('period'))
    ?? viewModel.profile.periods[0];
  const periodMarkets = viewModel.marketsByPeriod[selectedPeriod.key] ?? viewModel.markets;
  const selectedMarket = useMemo(() => {
    const requested = searchParams.get('market');
    return periodMarkets.find((item) => item.available && item.definition.key === requested)
      ?? periodMarkets.find((item) => item.definition.key === viewModel.defaultMarketKey)
      ?? periodMarkets[0];
  }, [periodMarkets, searchParams, viewModel.defaultMarketKey]);
  const line = normalizedLine(searchParams.get('line'), selectedMarket);

  useEffect(() => {
    const canonical = new URLSearchParams(searchParams);
    const next: PlayerRouteSelection = {
      marketKey: selectedMarket.definition.key,
      line,
      periodKey: selectedPeriod.key,
    };
    canonical.set('market', next.marketKey);
    canonical.set('line', String(next.line));
    canonical.set('period', next.periodKey);
    if (canonical.toString() !== searchParams.toString()) setSearchParams(canonical, { replace: true });
  }, [line, searchParams, selectedMarket.definition.key, selectedPeriod.key, setSearchParams]);

  const update = (changes: Partial<PlayerRouteSelection>) => {
    const next = new URLSearchParams(searchParams);
    if (changes.marketKey) {
      const market = periodMarkets.find((item) => item.available && item.definition.key === changes.marketKey);
      if (market) {
        next.set('market', market.definition.key);
        next.set('line', String(market.canonicalLine));
      }
    }
    if (changes.line !== undefined) next.set('line', String(Math.max(0, changes.line)));
    if (changes.periodKey) {
      const nextMarkets = viewModel.marketsByPeriod[changes.periodKey];
      const nextMarket = nextMarkets?.find((item) => item.definition.key === (changes.marketKey ?? selectedMarket.definition.key)) ?? nextMarkets?.[0];
      next.set('period', changes.periodKey);
      if (nextMarket) next.set('line', String(nextMarket.canonicalLine));
    }
    setSearchParams(next, { replace: true });
  };

  return { selectedMarket, selectedPeriod, line, update };
}
