import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { PLAYERS, PROPS, teamName } from '@/features/dashboard/data';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { PlayerAvatar } from './common';

interface Props {
  onPickProp?: (market: string) => void;
  onPickPlayer?: (playerId: string) => void;
}

export function GlobalSearch({ onPickPlayer }: Props) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { navigate, openDrawer, sport } = useDashboard();

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (query.length < 2) return null;
    const pool = sport === 'All' ? PLAYERS : PLAYERS.filter((p) => p.sport === sport);
    const players = pool.filter((p) => p.name.toLowerCase().includes(query)).slice(0, 5);
    const teamSet = [...new Set(pool.map((p) => p.team))];
    const teams = teamSet.filter((t) => t.toLowerCase().includes(query) || teamName(t).toLowerCase().includes(query)).slice(0, 4);
    const markets = [...new Set(PROPS.filter((p) => sport === 'All' || pool.some((pl) => pl.id === p.playerId)).map((p) => p.market))]
      .filter((m) => m.toLowerCase().includes(query)).slice(0, 4);
    return { players, teams, markets };
  }, [q, sport]);

  const flat = useMemo(() => {
    if (!results) return [];
    return [
      ...results.players.map((p) => ({ type: 'player' as const, id: p.id })),
      ...results.teams.map((t) => ({ type: 'team' as const, id: t })),
      ...results.markets.map((m) => ({ type: 'market' as const, id: m })),
    ];
  }, [results]);

  const pick = (item: { type: 'player' | 'team' | 'market'; id: string }) => {
    setOpen(false);
    setQ('');
    if (item.type === 'player') {
      if (onPickPlayer) onPickPlayer(item.id);
      else {
        const prop = PROPS.find((p) => p.playerId === item.id);
        if (prop) openDrawer(prop.id);
      }
    } else if (item.type === 'team') {
      navigate('players');
    } else {
      navigate('props');
    }
  };

  return (
    <div ref={ref} className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      <input
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setHighlight(0); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight((h) => Math.min(h + 1, flat.length - 1)); }
          if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight((h) => Math.max(h - 1, 0)); }
          if (e.key === 'Enter' && flat[highlight]) pick(flat[highlight]);
          if (e.key === 'Escape') setOpen(false);
        }}
        placeholder="Search players, teams, games, or props..."
        aria-label="Search players, teams, games, or props"
        role="combobox"
        aria-expanded={open && !!results}
        className="h-10 w-full rounded-lg border border-[#242424] bg-[#111111] pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#F5C542]/50 focus:outline-none focus:ring-1 focus:ring-[#F5C542]/40"
      />

      {open && results && (
        <div className="absolute inset-x-0 top-11 z-50 overflow-hidden rounded-lg border border-[#262626] bg-[#111111] shadow-2xl shadow-black/60" role="listbox">
          {flat.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-zinc-400">No players or teams found for "{q}".</p>
          )}
          {results.players.length > 0 && (
            <div className="py-1">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">Players</p>
              {results.players.map((p) => {
                const idx = flat.findIndex((f) => f.type === 'player' && f.id === p.id);
                return (
                  <button
                    key={p.id}
                    role="option"
                    aria-selected={highlight === idx}
                    onMouseDown={(e) => { e.preventDefault(); pick({ type: 'player', id: p.id }); }}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left ${highlight === idx ? 'bg-[#1c1c1c]' : 'hover:bg-[#181818]'}`}
                  >
                    <PlayerAvatar name={p.name} size="sm" />
                    <span className="flex-1 text-sm text-zinc-100">{p.name}</span>
                    <span className="text-xs text-zinc-500">{p.team} · {p.pos}</span>
                  </button>
                );
              })}
            </div>
          )}
          {results.teams.length > 0 && (
            <div className="border-t border-[#1c1c1c] py-1">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">Teams</p>
              {results.teams.map((t) => {
                const idx = flat.findIndex((f) => f.type === 'team' && f.id === t);
                return (
                  <button
                    key={t}
                    role="option"
                    aria-selected={highlight === idx}
                    onMouseDown={(e) => { e.preventDefault(); pick({ type: 'team', id: t }); }}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left ${highlight === idx ? 'bg-[#1c1c1c]' : 'hover:bg-[#181818]'}`}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#1c1c1c] text-[10px] font-bold text-[#F5C542]">{t.slice(0, 4)}</span>
                    <span className="flex-1 text-sm text-zinc-100">{teamName(t)}</span>
                  </button>
                );
              })}
            </div>
          )}
          {results.markets.length > 0 && (
            <div className="border-t border-[#1c1c1c] py-1">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">Prop Markets</p>
              {results.markets.map((m) => {
                const idx = flat.findIndex((f) => f.type === 'market' && f.id === m);
                return (
                  <button
                    key={m}
                    role="option"
                    aria-selected={highlight === idx}
                    onMouseDown={(e) => { e.preventDefault(); pick({ type: 'market', id: m }); }}
                    className={`flex w-full items-center px-3 py-2 text-left text-sm text-zinc-100 ${highlight === idx ? 'bg-[#1c1c1c]' : 'hover:bg-[#181818]'}`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
