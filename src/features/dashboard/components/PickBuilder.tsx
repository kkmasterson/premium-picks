import { ListPlus, Trash2, X } from 'lucide-react';
import { bestBook, formatOdds, playerById, propById } from '@/features/dashboard/data';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { marketKeyForName } from '@/features/dashboard/player-screen/profiles';

function BuilderContent({ onClose }: { onClose?: () => void }) {
  const { pickBuilder, removePick, clearPicks, navigate } = useDashboard();
  const resolved = pickBuilder.flatMap((item) => {
    const prop = propById(item.propId);
    if (!prop) return [];
    const player = playerById(prop.playerId);
    if (!player) return [];
    const offer = prop.books.find((book) => book.book === item.book) ?? bestBook(prop, item.side);
    return [{ item, prop, player, offer }];
  });

  return <div className="flex h-full flex-col">
    <header className="flex items-center justify-between border-b border-[#202020] px-4 py-3">
      <div>
        <p className="text-xs font-semibold text-zinc-100">Pick Builder</p>
        <p className="text-[10px] text-zinc-500">{resolved.length} research {resolved.length === 1 ? 'selection' : 'selections'}</p>
      </div>
      <div className="flex items-center gap-1">
        {resolved.length > 0 && <button onClick={clearPicks} className="rounded px-2 py-1 text-[10px] text-zinc-500 hover:bg-[#181818] hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]">Clear</button>}
        {onClose && <button onClick={onClose} aria-label="Close Pick Builder" className="rounded p-1.5 text-zinc-500 hover:bg-[#181818] hover:text-white"><X className="h-4 w-4" /></button>}
      </div>
    </header>

    <div className="flex-1 overflow-y-auto p-3">
      {resolved.length === 0 ? <div className="grid h-full min-h-52 place-items-center text-center"><div><span className="mx-auto grid h-10 w-10 place-items-center rounded-full border border-dashed border-[#3a3a3a] text-zinc-600"><ListPlus className="h-5 w-5" /></span><p className="mt-3 text-xs font-medium text-zinc-300">No research picks yet</p><p className="mt-1 max-w-44 text-[10px] leading-relaxed text-zinc-600">Add props from Popular, Discrepancies, or a research card.</p></div></div> : <div className="space-y-2">{resolved.map(({ item, prop, player, offer }) => <article key={prop.id} className="rounded-lg border border-[#252525] bg-[#111] p-3">
        <div className="flex items-start justify-between gap-2">
          <button onClick={() => navigate('player', { playerId: player.id, marketKey: marketKeyForName(prop.market, player.sport, player.pos), line: offer.line, periodKey: 'full', sport: player.sport })} className="min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]"><p className="truncate text-xs font-semibold text-zinc-100">{player.name}</p><p className="text-[9px] text-zinc-600">{player.team} {player.home ? 'vs' : '@'} {player.opponent}</p></button>
          <button onClick={() => removePick(prop.id)} aria-label={`Remove ${player.name} ${prop.market} from Pick Builder`} className="rounded p-1 text-zinc-600 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
        <div className="mt-2 flex items-end justify-between gap-2 border-t border-[#202020] pt-2">
          <div><p className="text-[9px] text-zinc-500">{prop.market}</p><p className="text-sm font-bold text-white">{item.side === 'over' ? 'Over' : 'Under'} {offer.line}</p></div>
          <div className="text-right"><p className="text-[9px] font-bold text-[#F5C542]">{offer.book}</p><p className="text-[10px] text-zinc-400">{formatOdds(item.side === 'over' ? offer.over : offer.under)}</p></div>
        </div>
      </article>)}</div>}
    </div>

    <footer className="border-t border-[#202020] p-3">
      <div className="mb-2 flex items-center justify-between text-[10px]"><span className="text-zinc-500">Selections</span><span className="font-semibold text-zinc-200">{resolved.length}</span></div>
      <button disabled={!resolved.length} className="w-full rounded-md bg-[#F5C542] py-2.5 text-xs font-bold text-black hover:bg-[#FFD95A] disabled:cursor-not-allowed disabled:bg-[#252525] disabled:text-zinc-600">Review {resolved.length || ''} {resolved.length === 1 ? 'pick' : 'picks'}</button>
      <p className="mt-2 text-center text-[8px] leading-relaxed text-zinc-700">Research organization only. No wager is placed.</p>
    </footer>
  </div>;
}

export function PickBuilderRail() {
  return <aside aria-label="Pick Builder" className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-72 shrink-0 border-l border-[#1b1b1b] bg-[#0b0b0b] xl:block"><BuilderContent /></aside>;
}

export function PickBuilderDrawer() {
  const { pickBuilder, pickBuilderOpen, setPickBuilderOpen } = useDashboard();
  return <>
    <button onClick={() => setPickBuilderOpen(true)} className="fixed bottom-20 right-3 z-30 flex items-center gap-2 rounded-full border border-[#F5C542]/40 bg-[#15130d] px-3 py-2 text-xs font-semibold text-[#F5C542] shadow-xl shadow-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542] md:bottom-4 xl:hidden" aria-label={`Open Pick Builder, ${pickBuilder.length} selections`}><ListPlus className="h-4 w-4" /> Picks {pickBuilder.length > 0 && <span className="rounded-full bg-[#F5C542] px-1.5 py-0.5 text-[9px] font-bold text-black">{pickBuilder.length}</span>}</button>
    {pickBuilderOpen && <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Pick Builder drawer"><button className="absolute inset-0 bg-black/65" onClick={() => setPickBuilderOpen(false)} aria-label="Close Pick Builder" /><div className="absolute inset-y-0 right-0 w-full max-w-sm border-l border-[#242424] bg-[#0b0b0b] shadow-2xl"><BuilderContent onClose={() => setPickBuilderOpen(false)} /></div></div>}
  </>;
}
