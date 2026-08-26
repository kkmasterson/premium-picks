import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router';
import type { PageKey, PickBuilderItem, Sport } from '@/features/dashboard/types';

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
  pickBuilder: PickBuilderItem[];
  pickBuilderOpen: boolean;
  setPickBuilderOpen: (open: boolean) => void;
  togglePick: (propId: string, side?: PickBuilderItem['side'], book?: string) => void;
  selectPick: (propId: string, side: PickBuilderItem['side'], book?: string) => void;
  removePick: (propId: string) => void;
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
        return parsed.filter((item): item is PickBuilderItem => {
          if (!item || typeof item !== 'object') return false;
          const candidate = item as Partial<PickBuilderItem>;
          return typeof candidate.propId === 'string'
            && (candidate.side === 'over' || candidate.side === 'under')
            && (candidate.book === undefined || typeof candidate.book === 'string');
        });
      }
    }
  } catch { /* ignore */ }
  return [];
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
      discrepancies: '/dashboard/discrepancies',
      players: '/dashboard/players',
      trends: '/dashboard/trends',
      matchups: '/dashboard/matchups',
      projections: '/dashboard/projections',
      saved: '/dashboard/saved',
      popular: '/dashboard/popular',
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
    setPickBuilder((previous) => previous.some((item) => item.propId === propId)
      ? previous.filter((item) => item.propId !== propId)
      : [...previous, { propId, side, book }]);
  };

  const removePick = (propId: string) => setPickBuilder((previous) => previous.filter((item) => item.propId !== propId));
  const selectPick = (propId: string, side: PickBuilderItem['side'], book?: string) => setPickBuilder((previous) => {
    const current = previous.find((item) => item.propId === propId);
    if (!current) return [...previous, { propId, side, book }];
    return previous.map((item) => item.propId === propId ? { propId, side, book } : item);
  });
  const clearPicks = () => setPickBuilder([]);
  const isInPickBuilder = (propId: string) => pickBuilder.some((item) => item.propId === propId);

  return (
    <Ctx.Provider value={{
      sport, setSport, page, navigate, playerId, gameId,
      drawerPropId, openDrawer: setDrawerPropId, closeDrawer: () => setDrawerPropId(null),
      saved, toggleSave, isSaved, density, setDensity: setDensityState,
      pickBuilder, pickBuilderOpen, setPickBuilderOpen, togglePick, selectPick, removePick, clearPicks, isInPickBuilder,
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
