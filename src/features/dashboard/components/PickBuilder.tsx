import { useState } from 'react';
import { AlertTriangle, ListPlus, PanelRightClose, PanelRightOpen, Trash2, X } from 'lucide-react';
import type { BuilderSelection } from '@arena/contracts';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { propBoardRowById } from '@/features/dashboard/props-fixtures';
import { SportsbookLogo } from '@/features/dashboard/components/SportsbookLogo';
import { cn } from '@/lib/utils';

function formatOdds(odds: number | null) { return odds === null ? 'Payout unavailable' : odds > 0 ? `+${odds}` : String(odds); }
function decimalOdds(odds: number | null) { return odds === null ? null : odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds); }

function warningsFor(items: BuilderSelection[]) {
  const warnings: string[] = [];
  const propCounts = new Map<string, number>();
  const sides = new Map<string, Set<string>>();
  for (const item of items) {
    propCounts.set(item.propId, (propCounts.get(item.propId) ?? 0) + 1);
    const propSides = sides.get(item.propId) ?? new Set<string>();
    propSides.add(item.side);
    sides.set(item.propId, propSides);
    const current = propBoardRowById(item.propId)?.offers.find((offer) => offer.id === item.offerId);
    if (!current) warnings.push(`${item.providerShortName} no longer lists one captured offer.`);
    else if (current.status !== 'active') warnings.push(`${item.providerShortName} marks one offer ${current.status}.`);
    else if (current.line !== item.capturedLine || (item.side === 'over' ? current.overOdds : current.underOdds) !== item.capturedOdds) warnings.push(`${item.providerShortName} changed a captured line or price.`);
  }
  if ([...propCounts.values()].some((count) => count > 1)) warnings.push('This research list includes multiple selections for the same prop.');
  if ([...sides.values()].some((set) => set.size > 1)) warnings.push('Opposing sides of the same prop are included.');
  return [...new Set(warnings)];
}

function BuilderContent({ onClose, onCollapse, routed = false }: { onClose?: () => void; onCollapse?: () => void; routed?: boolean }) {
  const { pickBuilder, removePick, clearPicks } = useDashboard();
  const groups = Object.values(pickBuilder.reduce<Record<string, BuilderSelection[]>>((result, item) => {
    (result[item.providerId] ??= []).push(item);
    return result;
  }, {}));
  const warnings = warningsFor(pickBuilder);
  return <div className="flex h-full flex-col">
    <header className="flex items-center justify-between border-b border-[#202020] px-4 py-3"><div><p className="text-sm font-semibold text-zinc-100">Mixed-provider Builder</p><p className="text-[10px] text-zinc-500">{pickBuilder.length} research {pickBuilder.length === 1 ? 'selection' : 'selections'}</p></div><div className="flex items-center gap-1">{pickBuilder.length > 0 && <button onClick={clearPicks} className="rounded px-2 py-1 text-[10px] text-zinc-500 hover:bg-[#181818] hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">Clear</button>}{onCollapse && <button onClick={onCollapse} aria-label="Collapse Pick Builder" title="Collapse Builder" className="rounded p-1.5 text-zinc-500 hover:bg-[#181818] hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"><PanelRightClose className="h-4 w-4" /></button>}{onClose && <button onClick={onClose} aria-label="Close Builder" className="rounded p-1.5 text-zinc-500 hover:bg-[#181818] hover:text-white"><X className="h-4 w-4" /></button>}</div></header>
    <div className="flex-1 overflow-y-auto p-3">{pickBuilder.length === 0 ? <div className="grid min-h-60 place-items-center text-center"><div><ListPlus className="mx-auto h-8 w-8 text-zinc-700"/><p className="mt-3 text-xs font-medium text-zinc-300">No research selections yet</p><p className="mt-1 max-w-52 text-[10px] leading-relaxed text-zinc-600">Choose an exact side, line, and provider from Props.</p></div></div> : <div className="space-y-4">
      {warnings.length > 0 && <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-[10px] text-amber-200"><p className="mb-1 flex items-center gap-1 font-semibold"><AlertTriangle className="h-3.5 w-3.5"/>Review warnings</p>{warnings.map((warning) => <p key={warning}>• {warning}</p>)}</div>}
      {groups.map((items) => {
        const product = items.map((item) => decimalOdds(item.capturedOdds)).reduce<number | null>((total, odds) => total === null || odds === null ? null : total * odds, 1);
        return <section key={items[0].providerId} className="rounded-xl border border-[#252525] bg-[#0d0d0d] p-3"><div className="mb-2 flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-2"><SportsbookLogo shortName={items[0].providerShortName} /><span className="min-w-0"><p className="truncate text-xs font-semibold text-teal-300">{items[0].providerName}</p><p className="text-[9px] text-zinc-600">Compatible provider group</p></span></div><p className="shrink-0 text-[10px] text-zinc-400">{product === null ? 'Payout unavailable' : `${product.toFixed(2)}x combined decimal`}</p></div><div className="space-y-2">{items.map((item) => {
          const row = propBoardRowById(item.propId); const current = row?.offers.find((offer) => offer.id === item.offerId);
          return <article key={item.key} className="rounded-lg border border-[#222] bg-[#121212] p-3"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-xs font-semibold text-zinc-100">{row?.playerName ?? 'Unavailable prop'}</p><p className="text-[9px] text-zinc-500">{row?.market} · {item.lineType}</p></div><button onClick={() => removePick(item.key)} aria-label="Remove selection" className="rounded p-1 text-zinc-600 hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div><div className="mt-2 flex items-end justify-between border-t border-[#222] pt-2"><p className="text-sm font-bold text-white">{item.side === 'over' ? 'Over' : 'Under'} {item.capturedLine}</p><div className="text-right"><p className="text-xs font-semibold text-teal-300">{formatOdds(item.capturedOdds)}</p><p className="text-[9px] text-zinc-600">Captured {new Date(item.capturedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}{current?.status !== 'active' ? ` · ${current?.status ?? 'removed'}` : ''}</p></div></div></article>;
        })}</div></section>;
      })}
    </div>}</div>
    <footer className="border-t border-[#202020] p-3"><div className="rounded-lg border border-teal-500/20 bg-teal-500/5 p-2.5 text-center text-[9px] leading-relaxed text-zinc-400">Research only. Arena Props does not place or transmit wagers. Mixed-provider selections do not have one actionable combined payout.</div>{!routed && <p className="mt-2 text-center text-[9px] text-zinc-600">Open Builder from navigation for the full workspace.</p>}</footer>
  </div>;
}

export function BuilderPage() { return <div className="mx-auto min-h-[70vh] max-w-3xl overflow-hidden rounded-xl border border-[#232323] bg-[#0b0b0b]"><BuilderContent routed /></div>; }
export function PickBuilderRail() {
  const { pickBuilder } = useDashboard();
  const [collapsed, setCollapsed] = useState(true);
  return <aside
    aria-label="Pick Builder"
    className={cn(
      'sticky top-14 hidden h-[calc(100vh-3.5rem)] shrink-0 overflow-hidden border-l border-[#1b1b1b] bg-[#0b0b0b] transition-[width,min-width,max-width] duration-200 xl:block',
      collapsed ? 'w-14 min-w-[3.5rem] max-w-[3.5rem]' : 'w-72 min-w-[18rem] max-w-[18rem]',
    )}
  >
    {collapsed ? <button
      onClick={() => setCollapsed(false)}
      aria-label="Expand Pick Builder"
      title="Expand Builder"
      className="group flex h-full w-full flex-col items-center gap-3 py-4 text-zinc-600 transition-colors hover:bg-teal-500/[0.035] hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500"
    >
      <PanelRightOpen className="h-4 w-4" />
      <span className="grid h-7 min-w-7 place-items-center rounded-full bg-teal-500/[0.10] px-1 text-[10px] font-bold text-teal-300 ring-1 ring-inset ring-teal-500/20">{pickBuilder.length}</span>
      <span className="[writing-mode:vertical-rl] text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-600 transition-colors group-hover:text-teal-300">Builder</span>
      <span className="sr-only">{pickBuilder.length} research {pickBuilder.length === 1 ? 'selection' : 'selections'}</span>
    </button> : <BuilderContent onCollapse={() => setCollapsed(true)} />}
  </aside>;
}
export function PickBuilderDrawer() { const { pickBuilder, pickBuilderOpen, setPickBuilderOpen } = useDashboard(); return <><button onClick={() => setPickBuilderOpen(true)} className="fixed bottom-4 right-3 z-30 hidden items-center gap-2 rounded-full border border-teal-500/40 bg-teal-950/70 px-3 py-2 text-xs font-semibold text-teal-300 shadow-xl md:flex xl:hidden" aria-label={`Open Builder, ${pickBuilder.length} selections`}><ListPlus className="h-4 w-4"/>Builder {pickBuilder.length > 0 && <span className="rounded-full bg-teal-400 px-1.5 py-0.5 text-[9px] font-bold text-black">{pickBuilder.length}</span>}</button>{pickBuilderOpen && <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Builder drawer"><button className="absolute inset-0 bg-black/65" onClick={() => setPickBuilderOpen(false)} aria-label="Close Builder"/><div className="absolute inset-y-0 right-0 w-full max-w-sm border-l border-[#242424] bg-[#0b0b0b]"><BuilderContent onClose={() => setPickBuilderOpen(false)}/></div></div>}</>; }
