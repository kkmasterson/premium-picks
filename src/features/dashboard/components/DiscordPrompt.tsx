import { useState } from 'react';
import { Check, X } from 'lucide-react';

const DISMISSED_KEY = 'arena-discord-prompt-dismissed';

function DiscordMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <path
        fill="currentColor"
        d="M19.5 5.3A16.3 16.3 0 0 0 15.4 4l-.5 1a14.1 14.1 0 0 0-5.8 0l-.5-1a16.3 16.3 0 0 0-4.1 1.3C1.9 9.1 1.2 12.8 1.5 16.4a16.7 16.7 0 0 0 5 2.5l1.2-1.7a10.8 10.8 0 0 1-1.9-.9l.5-.4a11.8 11.8 0 0 0 11.4 0l.5.4a10.8 10.8 0 0 1-1.9.9l1.2 1.7a16.7 16.7 0 0 0 5-2.5c.4-4.2-.7-7.9-3-11.1ZM8.8 14.7c-1.1 0-2-1-2-2.3 0-1.2.9-2.2 2-2.2s2 1 2 2.2c0 1.3-.9 2.3-2 2.3Zm6.4 0c-1.1 0-2-1-2-2.3 0-1.2.9-2.2 2-2.2s2 1 2 2.2c0 1.3-.9 2.3-2 2.3Z"
      />
    </svg>
  );
}

export function DiscordPrompt() {
  const [visible, setVisible] = useState(() => sessionStorage.getItem(DISMISSED_KEY) !== 'true');
  const [previewed, setPreviewed] = useState(false);

  const dismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <section
      role="dialog"
      aria-label="Join the Premium Picks Discord"
      className="fixed bottom-20 right-3 z-40 w-[calc(100%-1.5rem)] max-w-[360px] overflow-hidden rounded-xl border border-[#2b2d38] bg-[#111318]/95 shadow-2xl shadow-black/70 backdrop-blur-md md:bottom-4 md:right-[72px]"
    >
      <div className="h-1 bg-gradient-to-r from-[#5865f2] via-violet-500 to-teal-400" />
      <div className="p-3.5">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close Discord prompt"
          className="absolute right-3 top-3 rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5865f2]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex gap-3 pr-7">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#5865f2] text-white shadow-lg shadow-[#5865f2]/15">
            <DiscordMark />
          </span>
          <div className="min-w-0">
            <h2 className="text-[13px] font-bold text-zinc-100">Join the Premium Picks Discord</h2>
            <p className="mt-1 text-[10px] leading-relaxed text-zinc-400">
              Connect with the Premium Picks community, compare research, and get your member role when Discord integration launches.
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPreviewed(true)}
            className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-[#5865f2] px-3 text-[11px] font-bold text-white transition-colors hover:bg-[#6672f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b94ff]"
          >
            {previewed ? <><Check className="h-4 w-4" /> Coming soon</> : 'Connect Discord'}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="h-8 rounded-md px-2.5 text-[10px] font-semibold text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600"
          >
            Maybe later
          </button>
        </div>
        {previewed && <p className="mt-2 text-center text-[10px] text-violet-300" role="status">Discord connection is a frontend preview and is not active yet.</p>}
      </div>
    </section>
  );
}
