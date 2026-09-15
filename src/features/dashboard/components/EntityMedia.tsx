import { useState } from 'react';
import { cn } from '@/lib/utils';
import { sportMediaFor, teamMediaFor } from '@/features/dashboard/media-fixtures';
import type { Sport } from '@/features/dashboard/types';

export function SportIcon({ sport, className }: { sport: Sport; className?: string }) {
  const asset = sportMediaFor(sport);
  const [failedUrl, setFailedUrl] = useState<string>();
  const failed = failedUrl === asset.url;

  return (
    <span className={cn('inline-flex shrink-0 items-center justify-center', className)} aria-hidden="true">
      {!failed && (
        <img
          src={asset.url}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain"
          onError={() => setFailedUrl(asset.url)}
        />
      )}
    </span>
  );
}

export function TeamBadge({ team, name, sport, className }: { team: string; name?: string; sport?: Sport; className?: string }) {
  const candidate = sport && sport !== 'NBA' ? undefined : teamMediaFor(team);
  // Artwork is a curated display mapping, never an entity-identity lookup.
  const asset = candidate && (!name || candidate.label === name) ? candidate : undefined;
  const [failedUrl, setFailedUrl] = useState<string>();
  const failed = asset ? failedUrl === asset.badgeUrl : false;

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.035] p-1 text-[9px] font-bold text-zinc-500',
        className,
      )}
    >
      {asset && !failed ? (
        <img
          src={asset.badgeUrl}
          alt={`${asset.label} badge`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain"
          onError={() => setFailedUrl(asset.badgeUrl)}
        />
      ) : (
        <span aria-label={`${team} team badge unavailable`}>{team.slice(0, 3)}</span>
      )}
    </span>
  );
}
