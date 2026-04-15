import type { ReportResult } from './ChatMessageItem';

type ReportResultCardProps = {
  report: ReportResult;
};

export function ReportResultCard({ report }: ReportResultCardProps): JSX.Element {
  return (
    <article className="mt-2 rounded-xl border border-zinc-300 bg-[#fffaf6] p-2.5 shadow-sm shadow-zinc-300/30">
      <p className="text-[10px] uppercase tracking-[0.16em] text-orange-700">Reporte sugerido</p>
      <h4 className="mt-1 text-sm font-semibold text-slate-900">{report.title}</h4>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-700">{report.summary}</p>

      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        {report.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-md border border-zinc-300 bg-white px-2 py-1.5"
          >
            <dt className="text-[10px] text-slate-500">{metric.label}</dt>
            <dd className="mt-1 text-xs font-semibold text-slate-900">{metric.value}</dd>
          </div>
        ))}
      </dl>

      {report.actionLabel ? (
        <button
          type="button"
          className="mt-2.5 w-full rounded-md border border-orange-400 bg-orange-500 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          {report.actionLabel}
        </button>
      ) : null}
    </article>
  );
}
