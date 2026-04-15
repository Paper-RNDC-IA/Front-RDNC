import { Card } from './Card';
import { SectionHelpCard } from './SectionHelpCard';

type PageIntroProps = {
  title: string;
  subtitle: string;
  periodLabel?: string;
  highlights?: string[];
  moduleGuide?: {
    summary: string;
    purpose: string;
    userType: string;
    source: string;
    analysisType: string;
    scope: string;
    interpretation: string;
    limitations: string;
    useCases: string[];
  };
};

export function PageIntro({
  title,
  subtitle,
  periodLabel,
  moduleGuide,
}: PageIntroProps): JSX.Element {
  return (
    <Card className="border-orange-200/70 bg-gradient-to-b from-[#fffdfb] to-white">
      <div className="space-y-5">
        <div className="max-w-3xl border-l-4 border-orange-400 pl-4">
          <p className="text-xs uppercase tracking-[0.18em] text-orange-600">Analitica operativa</p>
          <h2 className="mt-1 text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">{title}</h2>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate-700">{subtitle}</p>
          {periodLabel ? (
            <p className="mt-3 inline-flex rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-slate-600">
              Periodo: {periodLabel}
            </p>
          ) : null}
        </div>

        {moduleGuide ? (
          <SectionHelpCard
            summary={moduleGuide.summary}
            purpose={moduleGuide.purpose}
            analysisType={moduleGuide.analysisType}
          />
        ) : null}
      </div>
    </Card>
  );
}
