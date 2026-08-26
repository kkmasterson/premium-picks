import { Bell, Bookmark, ChevronDown, CircleHelp, LogOut, Settings, User, CreditCard } from 'lucide-react';
import { Link } from 'react-router';
import { playerById, SPORTS } from '@/features/dashboard/data';
import { useDashboard } from '@/features/dashboard/DashboardProvider';
import { cn } from '@/lib/utils';
import type { Sport } from '@/features/dashboard/types';
import { GoldShield } from './common';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const ALL_SPORTS: (Sport | 'All')[] = ['All', ...SPORTS];

export function TopSportNav() {
  const { sport, setSport, navigate, saved, playerId } = useDashboard();
  const activeSport = playerId ? playerById(playerId)?.sport ?? sport : sport;
  const savedCount = saved.props.length + saved.players.length + saved.games.length;

  return (
    <header className="sticky top-0 z-40 border-b border-[#1a1a1a] bg-[#080808]/95 backdrop-blur">
      <div className="flex h-14 items-center gap-3 px-3 sm:px-5">
        <button
          className="flex shrink-0 items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542] rounded"
          onClick={() => navigate('props')}
          aria-label="Premium Picks home"
        >
          <GoldShield className="h-7 w-7" />
          <span className="hidden sm:block text-sm font-bold tracking-wide text-white">
            Premium <span className="text-[#F5C542]">Picks</span>
          </span>
        </button>

        <nav aria-label="Sports" className="no-scrollbar flex h-14 flex-1 items-stretch gap-0.5 overflow-x-auto px-1">
          {ALL_SPORTS.map((s) => (
            <button
              key={s}
              onClick={() => { setSport(s); if (playerId) navigate('props'); }}
              aria-current={activeSport === s ? 'page' : undefined}
              className={cn(
                'relative shrink-0 px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542] rounded-t',
                activeSport === s
                  ? 'text-[#F5C542] after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-[#F5C542]'
                  : 'text-zinc-400 hover:text-zinc-100',
              )}
            >
              {s}
            </button>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <button
            className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-md text-zinc-400 hover:bg-[#171717] hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="h-4.5 w-4.5 h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#F5C542]" aria-hidden />
          </button>
          <button
            onClick={() => navigate('saved')}
            className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-md text-zinc-400 hover:bg-[#171717] hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]"
            aria-label={`Saved research, ${savedCount} items`}
            title="Saved research"
          >
            <Bookmark className="h-[18px] w-[18px]" />
            {savedCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F5C542] px-1 text-[10px] font-bold text-black">
                {savedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate('help')}
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-md text-zinc-400 hover:bg-[#171717] hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]"
            aria-label="Help"
            title="Help"
          >
            <CircleHelp className="h-[18px] w-[18px]" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="ml-1 flex h-9 items-center gap-1.5 rounded-md px-1.5 hover:bg-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]"
                aria-label="Account menu"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F5C542] text-xs font-bold text-black">JD</span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 border-[#262626] bg-[#111111] text-zinc-200">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Jordan Davis</span>
                <Badge className="bg-[#F5C542]/15 text-[#F5C542] hover:bg-[#F5C542]/15 border border-[#F5C542]/30">Premium</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#262626]" />
              <DropdownMenuItem className="focus:bg-[#1d1d1d] focus:text-white"><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-[#1d1d1d] focus:text-white"><CreditCard className="mr-2 h-4 w-4" /> Subscription</DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-[#1d1d1d] focus:text-white"><Settings className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#262626]" />
              <DropdownMenuItem asChild className="focus:bg-[#1d1d1d] focus:text-white">
                <Link to="/"><LogOut className="mr-2 h-4 w-4" /> Log Out</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
