import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const FOUR_DAYS_MS = 4 * 24 * 60 * 60 * 1000;

export function DiscordPrompt({ signedIn, discordUrl }: { signedIn: boolean; discordUrl: string | null }) {
  const [visible, setVisible] = useState(() => {
    if (!signedIn || !discordUrl || localStorage.getItem('arena-discord-never') === '1') return false;
    const dismissedAt = Number(localStorage.getItem('arena-discord-dismissed-at') ?? 0);
    return Date.now() - dismissedAt >= FOUR_DAYS_MS;
  });
  if (!visible || !signedIn || !discordUrl) return null;
  const dismiss = () => { localStorage.setItem('arena-discord-dismissed-at', String(Date.now())); setVisible(false); };
  const never = () => { localStorage.setItem('arena-discord-never', '1'); setVisible(false); };
  return <aside className="fixed bottom-20 right-4 z-40 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-indigo-500/30 bg-[#111] p-4 shadow-2xl md:bottom-5" aria-label="Premium Picks Discord invitation"><button onClick={dismiss} aria-label="Close Discord invitation" className="absolute right-2 top-2 rounded p-1 text-zinc-600 hover:text-white"><X className="h-4 w-4"/></button><div className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-indigo-500 text-white"><MessageCircle className="h-5 w-5"/></span><div><p className="text-sm font-semibold text-white">Join Premium Picks on Discord</p><p className="mt-1 text-[10px] leading-relaxed text-zinc-400">Connect with the Premium Picks community for announcements and discussion.</p></div></div><a href={discordUrl} className="mt-3 block rounded-lg bg-indigo-500 py-2 text-center text-xs font-bold text-white">Open Discord</a><div className="mt-2 flex justify-center gap-4"><button onClick={dismiss} className="text-[9px] text-zinc-500 hover:text-white">Not now</button><button onClick={never} className="text-[9px] text-zinc-500 hover:text-white">Don't show again</button></div></aside>;
}
