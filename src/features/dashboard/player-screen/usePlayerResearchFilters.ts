import { useMemo, useState } from 'react';
import type { MarketSnapshot, ResearchFilters, ResearchHistoryEntry } from './types';

const EMPTY_FILTERS: ResearchFilters = { opponent: 'all', season: 'all', homeAway: 'all', team: 'all', event: 'all', courtType: 'all' };

function matches(entry: ResearchHistoryEntry, filters: ResearchFilters): boolean {
  if (filters.opponent !== 'all' && entry.opponent !== filters.opponent) return false;
  if (filters.season !== 'all' && entry.seasonKey !== filters.season) return false;
  if (filters.homeAway === 'home' && !entry.home) return false;
  if (filters.homeAway === 'away' && entry.home) return false;
  if (filters.team !== 'all' && entry.teamKey !== filters.team) return false;
  if (filters.event !== 'all' && entry.eventKey !== filters.event) return false;
  if (filters.courtType !== 'all' && entry.courtType !== filters.courtType) return false;
  return true;
}

function rate(history: ResearchHistoryEntry[], line: number, count?: number): number | null {
  const played = history.filter((entry) => entry.availability === 'played' && entry.value !== null).slice(0, count);
  return played.length ? Math.round((played.filter((entry) => (entry.value ?? 0) > line).length / played.length) * 100) : null;
}

export function filterMarketSnapshot(market: MarketSnapshot, filters: ResearchFilters, line: number): MarketSnapshot {
  const history = market.history.filter((entry) => matches(entry, filters));
  const values = history.filter((entry) => entry.availability === 'played' && entry.value !== null).map((entry) => entry.value as number);
  return {
    ...market,
    history,
    average: values.length ? Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10 : null,
    hitRates: { l5: rate(history, line, 5), l10: rate(history, line, 10), l15: rate(history, line, 15), season: rate(history, line), h2h: rate(history.filter((entry) => entry.opponent === filters.opponent || filters.opponent === 'all'), line) },
  };
}

export function usePlayerResearchFilters(market: MarketSnapshot, line: number) {
  const [filters, setFilters] = useState<ResearchFilters>(EMPTY_FILTERS);
  const [providerId, setProviderId] = useState('all');

  const filteredMarket = useMemo(() => filterMarketSnapshot(market, filters, line), [filters, line, market]);
  const updateFilter = (key: keyof ResearchFilters, value: string) => setFilters((current) => ({ ...current, [key]: value }));

  return { filters, updateFilter, providerId, setProviderId, filteredMarket };
}
