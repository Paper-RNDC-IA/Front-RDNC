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
    <Card className="border-[#d2daeb] bg-gradient-to-b from-[#fbfcff] to-white">
      <div className="space-y-5">
        <div className="max-w-4xl border-l-4 border-[#f07b1b] pl-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#f07b1b]">Analitica operativa</p>
          <h2 className="mt-1 text-4xl font-semibold leading-tight text-[#173a68] md:text-5xl">
            {title}
          </h2>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-[#556f98]">{subtitle}</p>
          {periodLabel ? (
            <p className="mt-3 inline-flex rounded-full border border-[#d7deee] bg-[#f8faff] px-3 py-1 text-sm text-[#496892]">
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
