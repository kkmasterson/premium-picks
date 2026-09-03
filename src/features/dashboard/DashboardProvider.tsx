import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router';
import { BuilderSelectionSchema, type AccessTier, type BuilderSelection, type Side } from '@arena/contracts';
import type { PageKey, PickBuilderItem, Sport } from '@/features/dashboard/types';
import { builderSelectionFor, offerFor, propBoardRowById } from '@/features/dashboard/props-fixtures';

interface NavigationOptions {
  playerId?: string;
  gameId?: string;
  marketKey?: string;
  line?: number;
  periodKey?: string;
  sport?: Sport;
  from?: 'popular' | 'discrepancies';
}

export type Density = 'comfortable' | 'standard' | 'compact';

interface SavedState {
  props: string[];
  players: string[];
  games: string[];
}

interface DashboardState {
  sport: Sport | 'All';
  setSport: (s: Sport | 'All') => void;
  page: PageKey;
  navigate: (page: PageKey, opts?: NavigationOptions) => void;
  playerId: string | null;
  gameId: string | null;
  drawerPropId: string | null;
  openDrawer: (propId: string) => void;
  closeDrawer: () => void;
  saved: SavedState;
  toggleSave: (type: keyof SavedState, id: string) => void;
  isSaved: (type: keyof SavedState, id: string) => boolean;
  density: Density;
  setDensity: (d: Density) => void;
  accessTier: AccessTier;
  pickBuilder: PickBuilderItem[];
  pickBuilderOpen: boolean;
  setPickBuilderOpen: (open: boolean) => void;
  togglePick: (propId: string, side?: PickBuilderItem['side'], book?: string) => void;
  selectPick: (propId: string, side: PickBuilderItem['side'], book?: string) => void;
  addPick: (selection: BuilderSelection) => void;
  removePick: (keyOrPropId: string) => void;
  clearPicks: () => void;
  isInPickBuilder: (propId: string) => boolean;
}

const Ctx = createContext<DashboardState | null>(null);

function loadSaved(): SavedState {
  try {
    const raw = localStorage.getItem('pp-saved');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { props: [], players: [], games: [] };
}

function loadPickBuilder(): PickBuilderItem[] {
  try {
    const raw = localStorage.getItem('pp-pick-builder');
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.flatMap((item) => {
          const result = BuilderSelectionSchema.safeParse(item);
          if (result.success) return [result.data];
          if (!item || typeof item !== 'object') return [];
          const legacy = item as { propId?: unknown; side?: unknown; book?: unknown };
          if (typeof legacy.propId !== 'string' || (legacy.side !== 'over' && legacy.side !== 'under')) return [];
          const migrated = legacySelection(legacy.propId, legacy.side, typeof legacy.book === 'string' ? legacy.book : undefined);
          return migrated ? [migrated] : [];
        });
      }
    }
  } catch { /* ignore */ }
  return [];
}

function legacySelection(propId: string, side: Side, book?: string): BuilderSelection | null {
  const row = propBoardRowById(propId);
  if (!row) return null;
  const offer = book
    ? row.offers.find((candidate) => candidate.providerShortName === book)
    : offerFor(row);
  return builderSelectionFor(row, offer ?? offerFor(row), side);
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const [sport, setSportState] = useState<Sport | 'All'>(() => {
    return (localStorage.getItem('pp-sport') as Sport | 'All') || 'All';
  });
  const [drawerPropId, setDrawerPropId] = useState<string | null>(null);
  const [saved, setSaved] = useState<SavedState>(loadSaved);
  const [pickBuilder, setPickBuilder] = useState<PickBuilderItem[]>(loadPickBuilder);
  const [pickBuilderOpen, setPickBuilderOpen] = useState(false);
  const [density, setDensityState] = useState<Density>(() => {
    return (localStorage.getItem('pp-density') as Density) || 'standard';
  });
  const accessTier: AccessTier = import.meta.env.VITE_DEMO_TIER === 'tier1' ? 'tier1' : 'tier2';

  useEffect(() => { localStorage.setItem('pp-saved', JSON.stringify(saved)); }, [saved]);
  useEffect(() => { localStorage.setItem('pp-density', density); }, [density]);
  useEffect(() => { localStorage.setItem('pp-pick-builder', JSON.stringify(pickBuilder)); }, [pickBuilder]);

  const setSport = (s: Sport | 'All') => {
    setSportState(s);
    localStorage.setItem('pp-sport', s);
  };

  const playerMatch = matchPath('/dashboard/players/:playerId', location.pathname);
  const gameMatch = matchPath('/dashboard/matchups/:gameId', location.pathname);
  const playerId = playerMatch?.params.playerId ?? null;
  const gameId = gameMatch?.params.gameId ?? null;

  const page: PageKey = playerId
    ? 'player'
    : gameId
      ? 'game'
      : (location.pathname.split('/')[2] as PageKey | undefined) ?? 'props';

  const navigate = (p: PageKey, opts?: NavigationOptions) => {
    const paths: Record<Exclude<PageKey, 'player' | 'game'>, string> = {
      props: '/dashboard/props',
      ev: '/dashboard/ev',
      discrepancies: '/dashboard/discrepancies',
      players: '/dashboard/players',
      trends: '/dashboard/trends',
      matchups: '/dashboard/matchups',
      saved: '/dashboard/saved',
      popular: '/dashboard/popular',
      builder: '/dashboard/builder',
      help: '/dashboard/help',
    };

    if (p === 'player') {
      if (opts?.sport) setSport(opts.sport);
      if (opts?.playerId) {
        const query = new URLSearchParams();
        if (opts.marketKey) query.set('market', opts.marketKey);
        if (opts.line !== undefined) query.set('line', String(opts.line));
        if (opts.periodKey) query.set('period', opts.periodKey);
        if (opts.from) query.set('from', opts.from);
        const suffix = query.size ? `?${query.toString()}` : '';
        routerNavigate(`/dashboard/players/${encodeURIComponent(opts.playerId)}${suffix}`);
      } else {
        routerNavigate('/dashboard/players');
      }
    } else if (p === 'game') {
      routerNavigate(opts?.gameId ? `/dashboard/matchups/${encodeURIComponent(opts.gameId)}` : '/dashboard/matchups');
    } else {
      routerNavigate(paths[p]);
    }

    setDrawerPropId(null);
    window.scrollTo(0, 0);
  };

  const toggleSave = (type: keyof SavedState, id: string) => {
    setSaved((prev) => {
      const list = prev[type];
      return { ...prev, [type]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] };
    });
  };

  const isSaved = (type: keyof SavedState, id: string) => saved[type].includes(id);

  const togglePick = (propId: string, side: PickBuilderItem['side'] = 'over', book?: string) => {
    const selection = legacySelection(propId, side, book);
    if (!selection) return;
    setPickBuilder((previous) => previous.some((item) => item.propId === propId)
      ? previous.filter((item) => item.propId !== propId)
      : [...previous, selection]);
  };

  const removePick = (keyOrPropId: string) => setPickBuilder((previous) => previous.filter((item) => item.key !== keyOrPropId && item.propId !== keyOrPropId));
  const addPick = (selection: BuilderSelection) => setPickBuilder((previous) => previous.some((item) => item.key === selection.key) ? previous : [...previous, selection]);
  const selectPick = (propId: string, side: PickBuilderItem['side'], book?: string) => {
    const selection = legacySelection(propId, side, book);
    if (!selection) return;
    setPickBuilder((previous) => {
      const withoutSamePropSide = previous.filter((item) => !(item.propId === propId && item.side === side));
      return [...withoutSamePropSide, selection];
    });
  };
  const clearPicks = () => setPickBuilder([]);
  const isInPickBuilder = (propId: string) => pickBuilder.some((item) => item.propId === propId);

  return (
    <Ctx.Provider value={{
      sport, setSport, page, navigate, playerId, gameId,
      drawerPropId, openDrawer: setDrawerPropId, closeDrawer: () => setDrawerPropId(null),
      saved, toggleSave, isSaved, density, setDensity: setDensityState,
      accessTier, pickBuilder, pickBuilderOpen, setPickBuilderOpen, togglePick, selectPick, addPick, removePick, clearPicks, isInPickBuilder,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
