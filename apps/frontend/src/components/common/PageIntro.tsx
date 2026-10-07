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
    <Card className="border-[#e5e7eb] bg-white !p-8 md:!p-10">
      <div className="space-y-5">
        <div className="max-w-4xl">
          <p className="text-xs font-medium uppercase tracking-[0.025em] text-[#4a5565]">Analitica operativa</p>
          <h2 className="mt-3 text-4xl font-light leading-[1.1] tracking-[-0.03em] text-[#101828] md:text-5xl">
            {title}
          </h2>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-[#4a5565]">{subtitle}</p>
          {periodLabel && /\d/.test(periodLabel) ? (
            <p className="mt-3 inline-flex rounded-lg border border-[#d4d4d4] px-3 py-1 text-xs font-medium uppercase tracking-[0.025em] text-[#4a5565]">
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
