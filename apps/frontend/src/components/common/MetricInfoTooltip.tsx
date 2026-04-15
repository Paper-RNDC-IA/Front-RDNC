type MetricInfoTooltipProps = {
  label?: string;
  meaning: string;
  interpretation?: string;
  source?: string;
  calculation?: string;
  className?: string;
};

export function MetricInfoTooltip({
  label = 'Info',
  meaning,
  interpretation,
  source,
  calculation,
  className,
}: MetricInfoTooltipProps): JSX.Element {
  return (
    <div className={["group relative inline-flex", className ?? ''].join(' ')}>
      <button
        type="button"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-zinc-300 bg-white text-[11px] font-semibold text-slate-700 transition-colors hover:border-orange-300 hover:text-orange-700"
        aria-label={label}
      >
        i
      </button>
      <div className="pointer-events-none invisible absolute right-0 top-7 z-20 w-72 rounded-xl border border-zinc-200 bg-white p-3 text-xs text-slate-700 opacity-0 shadow-[0_18px_36px_rgba(15,23,42,0.12)] transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <p className="font-semibold text-orange-700">{label}</p>
        <p className="mt-1 leading-relaxed text-slate-700">{meaning}</p>
        {interpretation ? (
          <p className="mt-2 text-slate-600">
            <span className="font-semibold text-slate-800">Interpretacion:</span> {interpretation}
          </p>
        ) : null}
        {calculation ? (
          <p className="mt-1 text-slate-600">
            <span className="font-semibold text-slate-800">Calculo:</span> {calculation}
          </p>
        ) : null}
        {source ? null : null}
      </div>
    </div>
  );
}
