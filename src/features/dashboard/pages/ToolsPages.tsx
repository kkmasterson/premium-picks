import { BookOpen, Calculator } from 'lucide-react';
import { DashboardPageHeader, ResearchSurface } from '@/features/dashboard/components/dashboard-ui';

function Placeholder({
  eyebrow,
  title,
  description,
  icon: Icon,
  note,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ElementType;
  note: string;
}) {
  return (
    <div className="space-y-3">
      <DashboardPageHeader eyebrow={eyebrow} title={title} description={description} />
      <ResearchSurface className="grid min-h-[360px] place-items-center border-dashed">
        <div className="max-w-sm px-6 text-center">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-teal-500/20 bg-teal-500/[0.07] text-teal-300">
            <Icon className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-zinc-200">Coming soon</p>
          <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">{note}</p>
        </div>
      </ResearchSurface>
    </div>
  );
}

export function CalculatorsPage() {
  return <Placeholder eyebrow="Tools" title="Calculators" description="Arena Props calculators and supporting research tools." icon={Calculator} note="Calculator modules will be added here as their formulas and inputs are finalized." />;
}

export function GuidesPage() {
  return <Placeholder eyebrow="Tools" title="Guides" description="Product guides, research explanations, and reference material." icon={BookOpen} note="This page is reserved for guides once the Arena Props workflow and information are set in stone." />;
}
