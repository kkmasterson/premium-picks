import { cn } from '@/lib/utils';

const SPORTSBOOK_LOGOS: Record<string, {
  name: string;
  src: string;
  surface: string;
  imageClassName?: string;
  brandMask?: string;
}> = {
  DK: {
    name: 'DraftKings',
    src: '/assets/sportsbooks/draftkings.png',
    surface: 'bg-[#16130f]',
    brandMask: 'linear-gradient(180deg, #f97316 0%, #f97316 42%, #22c55e 43%, #22c55e 100%)',
  },
  FD: {
    name: 'FanDuel',
    src: '/assets/sportsbooks/fanduel.svg',
    surface: 'bg-[#081626]',
  },
  MGM: {
    name: 'BetMGM',
    src: '/assets/sportsbooks/betmgm.jpg',
    surface: 'bg-black',
    imageClassName: 'scale-[1.72]',
  },
  CZR: {
    name: 'Caesars Sportsbook',
    src: '/assets/sportsbooks/caesars.jpg',
    surface: 'bg-white',
    imageClassName: 'scale-[0.94]',
  },
  FAN: {
    name: 'Fanatics Sportsbook',
    src: '/assets/sportsbooks/fanatics.svg',
    surface: 'bg-[#111313]',
  },
  B365: {
    name: 'bet365',
    src: '/assets/sportsbooks/bet365.svg',
    surface: 'bg-[#087b5b]',
  },
};

export function SportsbookLogo({
  shortName,
  compact = false,
  className,
}: {
  shortName: string;
  compact?: boolean;
  className?: string;
}) {
  const logo = SPORTSBOOK_LOGOS[shortName.toUpperCase()];

  if (!logo) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          'grid shrink-0 place-items-center rounded-md border border-white/10 bg-white/[0.04] font-bold text-zinc-400',
          compact ? 'h-5 w-8 text-[7px]' : 'h-6 w-10 text-[8px]',
          className,
        )}
      >
        {shortName.slice(0, 4)}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      data-sportsbook-logo={shortName.toUpperCase()}
      title={logo.name}
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md ring-1 ring-inset ring-white/[0.09]',
        compact ? 'h-5 w-9' : 'h-6 w-11',
        logo.surface,
        className,
      )}
    >
      {logo.brandMask ? (
        <span
          className="h-full w-full"
          style={{
            background: logo.brandMask,
            WebkitMaskImage: `url(${logo.src})`,
            maskImage: `url(${logo.src})`,
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: 'calc(100% - 4px)',
            maskSize: 'calc(100% - 4px)',
          }}
        />
      ) : (
        <img
          src={logo.src}
          alt=""
          className={cn('h-full w-full object-contain p-0.5', logo.imageClassName)}
        />
      )}
    </span>
  );
}
