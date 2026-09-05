import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import {
  BellRing, Bookmark, Check, CircleUserRound, CreditCard,
  Mail, Pencil, Settings, ShieldCheck, Sparkles, UserRound, X,
} from 'lucide-react';
import { useDashboard, type Density } from '@/features/dashboard/DashboardProvider';
import { DashboardPageHeader, ResearchSurface } from '@/features/dashboard/components/dashboard-ui';
import { cn } from '@/lib/utils';
import type { Sport } from '@/features/dashboard/types';
import { profileInitials, useArenaProfile, type ProfileRecord, type SportsbookKey } from '@/features/dashboard/profile';
import { SportsbookLogo } from '@/features/dashboard/components/SportsbookLogo';
import { BOOKS } from '@/features/dashboard/data';

interface PreferenceRecord {
  oddsFormat: 'American' | 'Decimal';
  lineMovement: boolean;
  productUpdates: boolean;
  weeklyRecap: boolean;
}

const DEFAULT_PREFERENCES: PreferenceRecord = {
  oddsFormat: 'American',
  lineMovement: true,
  productUpdates: false,
  weeklyRecap: true,
};

const PREFERENCES_KEY = 'arena-profile-preferences';
const SPORTSBOOKS = Object.entries(BOOKS) as Array<[SportsbookKey, string]>;

function loadLocal<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? { ...fallback, ...JSON.parse(stored) } : fallback;
  } catch {
    return fallback;
  }
}

export function ProfilePage() {
  const { saved, pickBuilder, density, setDensity } = useDashboard();
  const [searchParams, setSearchParams] = useSearchParams();
  const [profile, setProfile] = useArenaProfile();
  const [draft, setDraft] = useState(profile);
  const [preferenceDraft, setPreferenceDraft] = useState(() => loadLocal(PREFERENCES_KEY, DEFAULT_PREFERENCES));
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const requestedPanel = searchParams.get('panel');
  const panel = requestedPanel === 'settings' ? requestedPanel : 'profile';
  const savedCount = saved.props.length + saved.players.length + saved.games.length;

  const activity = useMemo(() => [
    { label: 'Saved research', value: savedCount, icon: Bookmark },
    { label: 'Builder selections', value: pickBuilder.length, icon: Sparkles },
    { label: 'Favorite sport', value: profile.favoriteSport, icon: CircleUserRound },
  ], [pickBuilder.length, profile.favoriteSport, savedCount]);

  const openPanel = (next: 'profile' | 'settings') => {
    setNotice(null);
    setSearchParams(next === 'profile' ? {} : { panel: next });
  };

  const saveProfile = (event: FormEvent) => {
    event.preventDefault();
    const clean = {
      ...draft,
      displayName: draft.displayName.trim(),
      username: draft.username.trim().replace(/^@/, ''),
      email: draft.email.trim(),
      bio: draft.bio.trim(),
    };
    setProfile(clean);
    setDraft(clean);
    setEditing(false);
    setNotice('Profile changes saved on this device.');
  };

  const savePreferences = (event: FormEvent) => {
    event.preventDefault();
    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferenceDraft));
    setNotice('Settings saved on this device.');
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-3">
      <DashboardPageHeader
        eyebrow="Account"
        title="Profile"
        description="Manage your Arena Props identity, membership, and research preferences."
        actions={panel !== 'settings' ? (
          <button onClick={() => openPanel('settings')} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--dashboard-border-strong)] bg-[var(--dashboard-surface)] px-3 text-[10px] font-semibold text-zinc-300 transition hover:border-teal-500/35 hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60">
            <Settings className="h-3.5 w-3.5" /> Settings
          </button>
        ) : (
          <button onClick={() => openPanel('profile')} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--dashboard-border-strong)] px-3 text-[10px] font-semibold text-zinc-400 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60">
            <UserRound className="h-3.5 w-3.5" /> Back to profile
          </button>
        )}
      />

      {notice && <div role="status" className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.07] px-3 py-2 text-[11px] text-emerald-300"><Check className="h-3.5 w-3.5" />{notice}</div>}

      <ProfileHero profile={profile} onEdit={() => { setDraft(profile); setEditing(true); setNotice(null); }} />

      {panel === 'settings' ? (
        <SettingsPanel
          density={density}
          setDensity={setDensity}
          preferences={preferenceDraft}
          setPreferences={setPreferenceDraft}
          onSubmit={savePreferences}
        />
      ) : editing ? (
        <EditProfileForm
          draft={draft}
          setDraft={setDraft}
          onSubmit={saveProfile}
          onCancel={() => { setDraft(profile); setEditing(false); }}
        />
      ) : (
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.75fr)]">
          <div className="space-y-3">
            <ResearchSurface>
              <SectionHeading icon={<UserRound className="h-4 w-4" />} title="About" description="The details shown on your Arena Props account." />
              <div className="grid gap-px bg-[var(--dashboard-border)] sm:grid-cols-2">
                <ProfileDetail label="Display name" value={profile.displayName} />
                <ProfileDetail label="Username" value={`@${profile.username}`} />
                <ProfileDetail label="Email" value={profile.email} icon={<Mail className="h-3 w-3" />} />
                <ProfileDetail label="Favorite sport" value={profile.favoriteSport} />
                <ProfileDetail label="Favorite sportsbook" value={<span className="inline-flex items-center gap-2"><SportsbookLogo shortName={profile.favoriteSportsbook} compact />{BOOKS[profile.favoriteSportsbook]}</span>} />
              </div>
              <div className="border-t border-[var(--dashboard-border)] px-4 py-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-600">Bio</p>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">{profile.bio || 'No bio added yet.'}</p>
              </div>
            </ResearchSurface>

            <ResearchSurface>
              <SectionHeading icon={<Sparkles className="h-4 w-4" />} title="Research activity" description="A quick view of your locally saved dashboard activity." />
              <div className="grid divide-y divide-[var(--dashboard-border)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {activity.map(({ label, value, icon: Icon }) => <div key={label} className="px-4 py-4"><Icon className="h-4 w-4 text-teal-400" /><p className="mt-3 text-lg font-bold text-zinc-100">{value}</p><p className="mt-0.5 text-[10px] text-zinc-600">{label}</p></div>)}
              </div>
            </ResearchSurface>
          </div>

          <div className="space-y-3">
            <PlanCard onManage={() => setNotice('The billing portal is not connected in this interactive preview yet.')} />
            <ResearchSurface>
              <SectionHeading icon={<ShieldCheck className="h-4 w-4" />} title="Account security" description="Security controls for your Arena Props account." />
              <div className="space-y-3 px-4 py-4">
                <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-medium text-zinc-200">Password</p><p className="text-[10px] text-zinc-600">Last changed 42 days ago</p></div><button onClick={() => setNotice('Password changes will be available when account authentication is connected.')} className="text-[10px] font-semibold text-teal-300 hover:text-teal-200">Update</button></div>
                <div className="border-t border-[var(--dashboard-border)] pt-3"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-medium text-zinc-200">Two-factor authentication</p><p className="text-[10px] text-zinc-600">Not enabled</p></div><button onClick={() => setNotice('Two-factor authentication requires the production account service.')} className="text-[10px] font-semibold text-teal-300 hover:text-teal-200">Set up</button></div></div>
              </div>
            </ResearchSurface>
          </div>
        </div>
      )}
      <p className="px-1 text-[9px] leading-relaxed text-zinc-700">Interactive demo preview · Profile changes and preferences are stored only in this browser. No live account or billing connection.</p>
    </div>
  );
}

function ProfileHero({ profile, onEdit }: { profile: ProfileRecord; onEdit: () => void }) {
  return <section className="relative overflow-hidden rounded-xl border border-[var(--dashboard-border)] bg-[#0d1010]">
    <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_78%_0%,rgba(20,184,166,0.16),transparent_42%),linear-gradient(110deg,rgba(245,197,66,0.10),transparent_48%)]" />
    <div className="relative flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-end sm:px-6 sm:py-6">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-[#F5C542]/35 bg-[#F5C542] text-2xl font-black text-black shadow-[0_10px_35px_rgba(245,197,66,0.14)]">{profileInitials(profile.displayName)}</div>
      <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="truncate text-xl font-bold text-white sm:text-2xl">{profile.displayName}</h2><span className="rounded-full border border-[#F5C542]/30 bg-[#F5C542]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#F5C542]">Premium</span></div><p className="mt-1 text-xs text-zinc-500">@{profile.username} · Member since August 2026</p></div>
      <button onClick={onEdit} className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md bg-teal-500 px-3.5 text-[11px] font-bold text-[#061312] transition hover:bg-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"><Pencil className="h-3.5 w-3.5" /> Edit profile</button>
    </div>
  </section>;
}

function EditProfileForm({ draft, setDraft, onSubmit, onCancel }: { draft: ProfileRecord; setDraft: (value: ProfileRecord) => void; onSubmit: (event: FormEvent) => void; onCancel: () => void }) {
  return <ResearchSurface className="mx-auto max-w-3xl">
    <SectionHeading icon={<Pencil className="h-4 w-4" />} title="Edit profile" description="Update the account details shown across Arena Props." />
    <form onSubmit={onSubmit} className="space-y-4 p-4 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Display name"><input aria-label="Display name" required maxLength={60} value={draft.displayName} onChange={(event) => setDraft({ ...draft, displayName: event.target.value })} className={inputClass} /></Field><Field label="Username"><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-600">@</span><input aria-label="Username" required maxLength={30} value={draft.username} onChange={(event) => setDraft({ ...draft, username: event.target.value.replace(/[^a-zA-Z0-9_]/g, '') })} className={cn(inputClass, 'pl-7')} /></div></Field></div>
      <Field label="Email address"><input aria-label="Email address" required type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} className={inputClass} /></Field>
      <Field label="Bio" hint={`${draft.bio.length}/160`}><textarea aria-label="Bio" maxLength={160} rows={4} value={draft.bio} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} className={cn(inputClass, 'h-auto resize-none py-2.5')} /></Field>
      <Field label="Favorite sport"><select aria-label="Favorite sport" value={draft.favoriteSport} onChange={(event) => setDraft({ ...draft, favoriteSport: event.target.value as Sport })} className={inputClass}>{['NBA', 'NFL', 'MLB', 'NHL', 'WNBA', 'NCAAB', 'NCAAF', 'SOCCER', 'TENNIS', 'LOL', 'CS2', 'VALORANT'].map((sport) => <option key={sport}>{sport}</option>)}</select></Field>
      <Field label="Favorite sportsbook" hint="Choose the book you use most">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Favorite sportsbook">
          {SPORTSBOOKS.map(([shortName, name]) => (
            <button
              key={shortName}
              type="button"
              role="radio"
              aria-checked={draft.favoriteSportsbook === shortName}
              onClick={() => setDraft({ ...draft, favoriteSportsbook: shortName })}
              className={cn(
                'flex min-h-12 items-center gap-2 rounded-md border px-3 py-2 text-left text-[10px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60',
                draft.favoriteSportsbook === shortName
                  ? 'border-teal-500/45 bg-teal-500/10 text-teal-200'
                  : 'border-[var(--dashboard-border-strong)] text-zinc-400 hover:border-zinc-600 hover:text-zinc-200',
              )}
            >
              <SportsbookLogo shortName={shortName} compact />
              <span className="min-w-0 truncate">{name}</span>
              {draft.favoriteSportsbook === shortName && <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-teal-400" />}
            </button>
          ))}
        </div>
      </Field>
      <div className="flex justify-end gap-2 border-t border-[var(--dashboard-border)] pt-4"><button type="button" onClick={onCancel} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--dashboard-border-strong)] px-3.5 text-[11px] font-semibold text-zinc-400 hover:text-zinc-100"><X className="h-3.5 w-3.5" />Cancel</button><button type="submit" className="inline-flex h-9 items-center gap-1.5 rounded-md bg-teal-500 px-3.5 text-[11px] font-bold text-[#061312] hover:bg-teal-400"><Check className="h-3.5 w-3.5" />Save changes</button></div>
    </form>
  </ResearchSurface>;
}

function SettingsPanel({ density, setDensity, preferences, setPreferences, onSubmit }: { density: Density; setDensity: (density: Density) => void; preferences: PreferenceRecord; setPreferences: (preferences: PreferenceRecord) => void; onSubmit: (event: FormEvent) => void }) {
  return <form onSubmit={onSubmit} className="grid gap-3 lg:grid-cols-2">
    <ResearchSurface>
      <SectionHeading icon={<Settings className="h-4 w-4" />} title="Research preferences" description="Choose how data is displayed in your workspace." />
      <div className="space-y-5 p-4">
        <Field label="Odds format"><div className="grid grid-cols-2 gap-2">{(['American', 'Decimal'] as const).map((format) => <ChoiceButton key={format} selected={preferences.oddsFormat === format} onClick={() => setPreferences({ ...preferences, oddsFormat: format })}>{format}<span className="block text-[9px] font-normal text-zinc-600">{format === 'American' ? '+120' : '2.20'}</span></ChoiceButton>)}</div></Field>
        <Field label="Dashboard density"><div className="grid grid-cols-3 gap-2">{(['comfortable', 'standard', 'compact'] as const).map((option) => <ChoiceButton key={option} selected={density === option} onClick={() => setDensity(option)}>{option[0].toUpperCase() + option.slice(1)}</ChoiceButton>)}</div></Field>
      </div>
    </ResearchSurface>
    <ResearchSurface>
      <SectionHeading icon={<BellRing className="h-4 w-4" />} title="Notifications" description="Control which account updates you want to receive." />
      <div className="divide-y divide-[var(--dashboard-border)] px-4">{[
        ['lineMovement', 'Line movement alerts', 'Notify me when a saved line moves.'],
        ['weeklyRecap', 'Weekly research recap', 'A summary of saved props and research.'],
        ['productUpdates', 'Product updates', 'New tools, sports, and platform changes.'],
      ].map(([key, title, description]) => <ToggleRow key={key} title={title} description={description} checked={preferences[key as keyof PreferenceRecord] as boolean} onChange={(checked) => setPreferences({ ...preferences, [key]: checked })} />)}</div>
    </ResearchSurface>
    <div className="flex justify-end lg:col-span-2"><button type="submit" className="inline-flex h-9 items-center gap-1.5 rounded-md bg-teal-500 px-4 text-[11px] font-bold text-[#061312] hover:bg-teal-400"><Check className="h-3.5 w-3.5" />Save settings</button></div>
  </form>;
}

function PlanCard({ onManage }: { onManage: () => void }) {
  return <ResearchSurface className="border-[#F5C542]/20 bg-[linear-gradient(145deg,rgba(245,197,66,0.06),rgba(13,16,16,1)_60%)]"><div className="p-4"><div className="flex items-start justify-between"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5C542]/15 text-[#F5C542]"><CreditCard className="h-4 w-4" /></div><span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] font-semibold text-emerald-400">Active</span></div><p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#F5C542]">Your plan</p><div className="mt-1 flex items-end justify-between gap-3"><h3 className="text-base font-bold text-white">Arena Props Premium</h3><p className="shrink-0 text-base font-black text-white">$19<span className="text-[9px] font-medium text-zinc-600">/month</span></p></div><p className="mt-1 text-[10px] text-zinc-600">Full dashboard access · Renews September 28, 2026</p><button onClick={onManage} className="mt-4 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-[#F5C542] px-3 text-[10px] font-bold text-black hover:bg-[#FFD95A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]/60"><CreditCard className="h-3.5 w-3.5" />Manage billing</button></div></ResearchSurface>;
}

function SectionHeading({ icon, title, description }: { icon: ReactNode; title: string; description: string }) { return <div className="flex items-start gap-2.5 border-b border-[var(--dashboard-border)] px-4 py-3"><span className="mt-0.5 text-teal-400">{icon}</span><div><h2 className="text-xs font-semibold text-zinc-100">{title}</h2><p className="mt-0.5 text-[10px] text-zinc-600">{description}</p></div></div>; }
function ProfileDetail({ label, value, icon }: { label: string; value: ReactNode; icon?: ReactNode }) { return <div className="bg-[var(--dashboard-surface)] px-4 py-3"><p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-600">{label}</p><div className="mt-1.5 flex min-h-5 items-center gap-1.5 truncate text-xs font-medium text-zinc-200">{icon}{value}</div></div>; }
function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) { return <div className="block"><span className="mb-1.5 flex justify-between text-[10px] font-semibold text-zinc-400"><span>{label}</span>{hint && <span className="font-normal text-zinc-600">{hint}</span>}</span>{children}</div>; }
function ChoiceButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) { return <button type="button" onClick={onClick} aria-pressed={selected} className={cn('min-h-10 rounded-md border px-2 py-2 text-[10px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60', selected ? 'border-teal-500/40 bg-teal-500/10 text-teal-300' : 'border-[var(--dashboard-border-strong)] text-zinc-500 hover:text-zinc-200')}>{children}</button>; }
function ToggleRow({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) { return <div className="flex items-center justify-between gap-4 py-4"><span><span className="block text-xs font-medium text-zinc-200">{title}</span><span className="mt-0.5 block text-[10px] text-zinc-600">{description}</span></span><button type="button" role="switch" aria-checked={checked} aria-label={title} onClick={() => onChange(!checked)} className={cn('relative h-5 w-9 shrink-0 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60', checked ? 'bg-teal-500' : 'bg-zinc-700')}><span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition', checked ? 'left-[18px]' : 'left-0.5')} /></button></div>; }

const inputClass = 'h-10 w-full rounded-md border border-[var(--dashboard-border-strong)] bg-[#0b0d0d] px-3 text-xs text-zinc-200 outline-none placeholder:text-zinc-700 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/10';
