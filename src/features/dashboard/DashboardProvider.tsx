import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router';
import type { PageKey, Sport } from '@/features/dashboard/types';

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
  navigate: (page: PageKey, opts?: { playerId?: string; gameId?: string }) => void;
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
}

const Ctx = createContext<DashboardState | null>(null);

function loadSaved(): SavedState {
  try {
    const raw = localStorage.getItem('pp-saved');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { props: [], players: [], games: [] };
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const [sport, setSportState] = useState<Sport | 'All'>(() => {
    return (localStorage.getItem('pp-sport') as Sport | 'All') || 'All';
  });
  const [drawerPropId, setDrawerPropId] = useState<string | null>(null);
  const [saved, setSaved] = useState<SavedState>(loadSaved);
  const [density, setDensityState] = useState<Density>(() => {
    return (localStorage.getItem('pp-density') as Density) || 'standard';
  });

  useEffect(() => { localStorage.setItem('pp-saved', JSON.stringify(saved)); }, [saved]);
  useEffect(() => { localStorage.setItem('pp-density', density); }, [density]);

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

  const navigate = (p: PageKey, opts?: { playerId?: string; gameId?: string }) => {
    const paths: Record<Exclude<PageKey, 'player' | 'game'>, string> = {
      props: '/dashboard/props',
      players: '/dashboard/players',
      trends: '/dashboard/trends',
      matchups: '/dashboard/matchups',
      projections: '/dashboard/projections',
      saved: '/dashboard/saved',
      help: '/dashboard/help',
    };

    if (p === 'player') {
      routerNavigate(opts?.playerId ? `/dashboard/players/${encodeURIComponent(opts.playerId)}` : '/dashboard/players');
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

  return (
    <Ctx.Provider value={{
      sport, setSport, page, navigate, playerId, gameId,
      drawerPropId, openDrawer: setDrawerPropId, closeDrawer: () => setDrawerPropId(null),
      saved, toggleSave, isSaved, density, setDensity: setDensityState,
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
