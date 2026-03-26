import type { ReportResult } from './ChatMessageItem';

type ReportResultCardProps = {
  report: ReportResult;
};

export function ReportResultCard({ report }: ReportResultCardProps): JSX.Element {
  return (
    <article className="mt-2 rounded-xl border border-slate-300 bg-slate-100/75 p-2.5 shadow-sm shadow-slate-500/10">
      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-700">Reporte sugerido</p>
      <h4 className="mt-1 text-sm font-semibold text-slate-800">{report.title}</h4>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-700">{report.summary}</p>

      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        {report.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-md border border-slate-300/80 bg-white px-2 py-1.5"
          >
            <dt className="text-[10px] text-slate-500">{metric.label}</dt>
            <dd className="mt-1 text-xs font-semibold text-slate-800">{metric.value}</dd>
          </div>
        ))}
      </dl>

      {report.actionLabel ? (
        <button
          type="button"
          className="mt-2.5 w-full rounded-md border border-slate-400/70 bg-slate-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-500"
        >
          {report.actionLabel}
        </button>
      ) : null}
    </article>
  );
}
