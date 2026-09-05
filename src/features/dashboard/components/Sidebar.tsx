import { useState } from 'react';
import {
  BookOpen, Bookmark, Bot, Calculator, ExternalLink, Flame, Gift, GitCompareArrows, ListFilter, ListPlus, LockKeyhole, Menu, PanelLeftClose, PanelLeftOpen, TrendingUp, Users, Swords, User,
} from 'lucide-react';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { cn } from '@/lib/utils';
import type { PageKey } from '@/features/dashboard/types';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { profileInitials, useArenaProfile } from '@/features/dashboard/profile';

interface Item { key: PageKey; label: string; icon: React.ElementType; }

const RESEARCH: Item[] = [
  { key: 'props', label: 'Props', icon: ListFilter },
  { key: 'players', label: 'Players', icon: Users },
  { key: 'matchups', label: 'Matchups', icon: Swords },
  { key: 'trends', label: 'Trends', icon: TrendingUp },
];
const EDGE: Item[] = [
  { key: 'ev', label: '+EV', icon: LockKeyhole },
  { key: 'discrepancies', label: 'Discrepancies', icon: GitCompareArrows },
];
const WORKSPACE: Item[] = [
  { key: 'builder', label: 'Builder', icon: ListPlus },
  { key: 'popular', label: 'Popular', icon: Flame },
  { key: 'saved', label: 'Saved', icon: Bookmark },
];
const TOOLS: Item[] = [
  { key: 'calculators', label: 'Calculators', icon: Calculator },
  { key: 'promos', label: 'Promos', icon: Gift },
  { key: 'guides', label: 'Guides', icon: BookOpen },
];
function NavItem({ item, collapsed }: { item: Item; collapsed: boolean }) {
  const { page, navigate } = useDashboard();
  const active = page === item.key || (item.key === 'players' && page === 'player') || (item.key === 'matchups' && page === 'game');
  const Icon = item.icon;
  const btn = (
    <button
      onClick={() => navigate(item.key)}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
        collapsed && 'justify-center px-0',
        active ? 'bg-[#1a1a1a] font-medium text-white' : 'text-zinc-400 hover:bg-[#141414] hover:text-zinc-200',
      )}
    >
      {active && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-teal-500" aria-hidden />}
      <Icon className={cn('h-[18px] w-[18px] shrink-0', active ? 'text-teal-400' : 'text-zinc-500 group-hover:text-zinc-300')} />
      {!collapsed && item.label}
    </button>
  );
  if (!collapsed) return btn;
  return (
    <Tooltip delayDuration={150}>
      <TooltipTrigger asChild>{btn}</TooltipTrigger>
      <TooltipContent side="right" className="border-[#2a2a2a] bg-[#171717] text-zinc-100">{item.label}</TooltipContent>
    </Tooltip>
  );
}

function Group({ label, items, collapsed }: { label: string; items: Item[]; collapsed: boolean }) {
  return (
    <div>
      {!collapsed && <div className="flex items-center gap-2 px-3 pb-1.5 pt-4"><p className="shrink-0 text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">{label}</p><span className="h-px flex-1 bg-[#202020]" /></div>}
      {collapsed && <div className="mx-3 my-3 border-t border-[#1c1c1c]" />}
      <div className="space-y-0.5">
        {items.map((i) => <NavItem key={i.key} item={i} collapsed={collapsed} />)}
      </div>
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { navigate } = useDashboard();
  const [profile] = useArenaProfile();
  return (
    <TooltipProvider>
      <aside
        className={cn(
          'sticky top-14 hidden h-[calc(100vh-3.5rem)] shrink-0 flex-col border-r border-[#161616] bg-[#0B0B0B] px-2 py-3 transition-all md:flex',
          collapsed ? 'w-14' : 'w-52',
        )}
        aria-label="Primary"
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto no-scrollbar">
          <div>
            <Group label="Research" items={RESEARCH} collapsed={collapsed} />
            <Group label="Edge" items={EDGE} collapsed={collapsed} />
            <Group label="Workspace" items={WORKSPACE} collapsed={collapsed} />
          </div>
          <div className="mt-auto pb-2">
            <Group label="Tools" items={TOOLS} collapsed={collapsed} />
          </div>
        </div>

        <div className="mt-2 border-t border-[#1c1c1c] pt-3">
          <button onClick={() => navigate('profile')} className={cn('flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left hover:bg-[#141414] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500', collapsed && 'justify-center px-0')} aria-label="Open profile">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5C542] text-xs font-bold text-black">{profileInitials(profile.displayName)}</span>
            {!collapsed && (
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 truncate text-xs font-medium text-zinc-200">
                  {profile.displayName}
                  <Badge className="h-4 border border-[#F5C542]/30 bg-[#F5C542]/10 px-1 text-[9px] text-[#F5C542] hover:bg-[#F5C542]/10">PRO</Badge>
                </p>
                <p className="flex items-center gap-1 text-[10px] text-zinc-500"><User className="h-2.5 w-2.5" /> Premium plan</p>
              </div>
            )}
          </button>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-md py-1.5 text-xs text-zinc-500 hover:bg-[#141414] hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <><PanelLeftClose className="h-4 w-4" /> Collapse</>}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
}

export function MobileBottomNav() {
  const { page, navigate } = useDashboard();
  const [moreOpen, setMoreOpen] = useState(false);
  const items: Item[] = [
    { key: 'props', label: 'Props', icon: ListFilter },
    { key: 'players', label: 'Players', icon: Users },
    { key: 'popular', label: 'Popular', icon: Flame },
    { key: 'builder', label: 'Builder', icon: ListPlus },
  ];
  const moreItems: Item[] = [
    { key: 'discrepancies', label: 'Discrepancies', icon: GitCompareArrows },
    { key: 'trends', label: 'Trends', icon: TrendingUp },
    { key: 'matchups', label: 'Matchups', icon: Swords },
    { key: 'saved', label: 'Saved', icon: Bookmark },
    { key: 'calculators', label: 'Calculators', icon: Calculator },
    { key: 'promos', label: 'Promos', icon: Gift },
    { key: 'guides', label: 'Guides', icon: BookOpen },
  ];
  const moreActive = moreItems.some((item) => item.key === page);
  return (
    <><nav aria-label="Mobile" className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[#1c1c1c] bg-[#0B0B0B]/95 backdrop-blur md:hidden">
      {items.map((i) => {
        const active = page === i.key;
        const Icon = i.icon;
        return (
          <button
            key={i.key}
            onClick={() => navigate(i.key)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500',
              active ? 'text-teal-400' : 'text-zinc-500',
            )}
          >
            <Icon className="h-5 w-5" />
            {i.label}
          </button>
        );
      })}
      <button onClick={() => setMoreOpen((open) => !open)} aria-expanded={moreOpen} className={cn('flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500', moreActive || moreOpen ? 'text-teal-400' : 'text-zinc-500')}><Menu className="h-5 w-5" />More</button>
    </nav>{moreOpen && <><button aria-label="Close more navigation" className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setMoreOpen(false)} /><div role="dialog" aria-modal="true" aria-label="More navigation" className="fixed inset-x-3 bottom-20 z-40 grid grid-cols-2 gap-2 rounded-xl border border-[#292929] bg-[#101010] p-3 shadow-2xl md:hidden">{moreItems.map((item) => { const Icon = item.icon; return <button key={item.key} onClick={() => { navigate(item.key); setMoreOpen(false); }} className={cn('flex items-center gap-2 rounded-lg border px-3 py-3 text-left text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500', page === item.key ? 'border-teal-500/40 bg-teal-500/10 text-teal-300' : 'border-[#252525] text-zinc-400')}><Icon className="h-4 w-4" />{item.label}</button>; })}<a href="/bonuses" className="flex items-center gap-2 rounded-lg border border-[#252525] px-3 py-3 text-xs text-zinc-400"><ExternalLink className="h-4 w-4"/>Bonuses</a><a href={import.meta.env.VITE_PREMIUM_PICKS_DISCORD_URL || '#'} aria-disabled={!import.meta.env.VITE_PREMIUM_PICKS_DISCORD_URL} className="flex items-center gap-2 rounded-lg border border-[#252525] px-3 py-3 text-xs text-zinc-400"><Bot className="h-4 w-4"/>Discord</a></div></>}
    </>
  );
}
