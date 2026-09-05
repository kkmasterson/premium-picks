import { useCallback, useEffect, useState } from 'react';
import type { Sport } from '@/features/dashboard/types';

export interface ProfileRecord {
  displayName: string;
  username: string;
  email: string;
  bio: string;
  favoriteSport: Sport;
  favoriteSportsbook: SportsbookKey;
}

export type SportsbookKey = 'DK' | 'FD' | 'MGM' | 'CZR' | 'FAN' | 'B365';

export const DEFAULT_PROFILE: ProfileRecord = {
  displayName: 'Jordan Davis',
  username: 'jordandavis',
  email: 'jordan.davis@example.com',
  bio: 'NBA and NFL props researcher. Building better reads one line at a time.',
  favoriteSport: 'NBA',
  favoriteSportsbook: 'DK',
};

export const PROFILE_KEY = 'arena-profile';
const PROFILE_EVENT = 'arena-profile-updated';

export function loadArenaProfile(): ProfileRecord {
  try {
    const stored = window.localStorage.getItem(PROFILE_KEY);
    return stored ? { ...DEFAULT_PROFILE, ...JSON.parse(stored) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function profileInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'AP';
}

export function useArenaProfile() {
  const [profile, setProfileState] = useState(loadArenaProfile);

  useEffect(() => {
    const refresh = () => setProfileState(loadArenaProfile());
    window.addEventListener(PROFILE_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(PROFILE_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const saveProfile = useCallback((next: ProfileRecord) => {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    setProfileState(next);
    window.dispatchEvent(new Event(PROFILE_EVENT));
  }, []);

  return [profile, saveProfile] as const;
}
