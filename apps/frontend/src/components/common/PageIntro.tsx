import { Card } from './Card';

type PageIntroProps = {
  title: string;
  subtitle: string;
  periodLabel?: string;
  highlights?: string[];
};

export function PageIntro({
  title,
  subtitle,
  periodLabel,
  highlights = [],
}: PageIntroProps): JSX.Element {
  return (
    <Card className="border-slate-700/80 bg-slate-900/70">
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-orange-300">Analitica operativa</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-50">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">{subtitle}</p>
          {periodLabel ? (
            <p className="mt-2 text-xs text-slate-400">Periodo: {periodLabel}</p>
          ) : null}
        </div>

        {highlights.length ? (
          <div className="flex flex-wrap gap-2">
            {highlights.slice(0, 4).map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs text-slate-300"
              >
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
