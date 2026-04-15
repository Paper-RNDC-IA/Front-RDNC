type ChartLegendHelpProps = {
  title?: string;
  description: string;
  xAxis: string;
  yAxis: string;
  interpretation: string;
};

export function ChartLegendHelp({
  title = 'Como leer este grafico',
  description,
  xAxis,
  yAxis,
  interpretation,
}: ChartLegendHelpProps): JSX.Element {
  return (
    <div className="mt-3 rounded-xl border border-zinc-200 bg-[#fffdfa] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-700">{description}</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <p className="text-[11px] text-slate-600">
          <span className="font-semibold text-slate-800">Eje X:</span> {xAxis}
        </p>
        <p className="text-[11px] text-slate-600">
          <span className="font-semibold text-slate-800">Eje Y:</span> {yAxis}
        </p>
        <p className="text-[11px] text-slate-600 sm:col-span-2">
          <span className="font-semibold text-slate-800">Interpretacion:</span> {interpretation}
        </p>
      </div>
    </div>
  );
}
