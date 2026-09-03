import { ArrowLeft, Check, Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import type { BonusOffer } from '@arena/contracts';

const KALSHI_OFFER: BonusOffer = {
  id: 'kalshi-launch',
  partnerName: 'Kalshi',
  offerSummary: 'Explore the confirmed Premium Picks partner offer',
  promoCode: null,
  eligibility: 'United States — subject to partner eligibility and verified partner terms.',
  expiresAt: null,
  termsUrl: null,
  claimUrl: import.meta.env.VITE_KALSHI_AFFILIATE_URL || null,
  disclosure: 'Premium Picks may earn compensation when an eligible user signs up through this link.',
  active: Boolean(import.meta.env.VITE_KALSHI_AFFILIATE_URL),
};

export default function BonusesPage() {
  const offer = KALSHI_OFFER;
  return <main className="min-h-screen bg-[#070707] text-white">
    <header className="border-b border-[#202020]"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4"><a href="/" className="text-lg font-extrabold italic">Premium <span className="text-[#F5C542]">Picks</span></a><a href="/dashboard/props" className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white"><ArrowLeft className="h-3.5 w-3.5"/>Arena Props</a></div></header>
    <section className="mx-auto max-w-6xl px-5 py-14"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F5C542]">Premium Picks Bonuses</p><h1 className="mt-3 max-w-2xl text-4xl font-black tracking-tight">Confirmed partner offers, without the clutter.</h1><p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">This public page only displays active, verified affiliate relationships. Arena Props accounts are not required to view offers.</p>
      <article className="mt-10 max-w-2xl rounded-2xl border border-[#F5C542]/25 bg-[#111] p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><span className="rounded-full border border-[#F5C542]/30 bg-[#F5C542]/10 px-2.5 py-1 text-[10px] font-bold text-[#F5C542]">CONFIRMED PARTNER</span><h2 className="mt-4 text-2xl font-bold">{offer.partnerName}</h2><p className="mt-2 text-sm text-zinc-400">{offer.offerSummary}</p></div><ShieldCheck className="h-10 w-10 text-[#F5C542]"/></div>
        <div className="mt-6 rounded-xl border border-[#292929] bg-[#0a0a0a] p-4"><p className="text-[10px] uppercase text-zinc-600">Promo code</p><div className="mt-1 flex items-center justify-between"><p className="font-mono text-sm text-zinc-300">{offer.promoCode ?? 'No verified code configured'}</p><button disabled={!offer.promoCode} className="rounded p-2 text-zinc-600"><Copy className="h-4 w-4"/></button></div></div>
        <ul className="mt-5 space-y-2 text-xs text-zinc-400"><li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-emerald-400"/>Offer value and terms must be verified by Premium Picks staff before activation.</li><li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-emerald-400"/>{offer.eligibility}</li></ul>
        <a href={offer.claimUrl ?? undefined} aria-disabled={!offer.active} className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold ${offer.active ? 'bg-[#F5C542] text-black hover:bg-[#FFD95A]' : 'cursor-not-allowed bg-[#292929] text-zinc-600'}`}>{offer.active ? 'View Kalshi offer' : 'Offer awaiting admin verification'}<ExternalLink className="h-4 w-4"/></a><p className="mt-4 text-[10px] leading-relaxed text-zinc-600">{offer.disclosure}</p>
      </article>
    </section>
  </main>;
}
