import type { KpiItem } from '../../types/common';
import { Card } from './Card';
import { MetricInfoTooltip } from './MetricInfoTooltip';

type KpiCardProps = {
  item: KpiItem;
  sourceLabel?: string;
};

export function KpiCard({
  item,
  sourceLabel = 'Fuente no especificada',
}: KpiCardProps): JSX.Element {
  const trendLabel =
    item.trend === 'up' ? 'En aumento' : item.trend === 'down' ? 'En descenso' : '';
  const trendColor =
    item.trend === 'up'
      ? 'text-orange-700'
      : item.trend === 'down'
        ? 'text-zinc-700'
        : 'text-slate-700';

  return (
    <Card className="border-zinc-200 bg-gradient-to-b from-white to-[#fffaf6]">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
        <MetricInfoTooltip
          label={`Ayuda: ${item.label}`}
          meaning={item.helperText ?? 'Indicador clave para el seguimiento del modulo.'}
          interpretation="Compara este valor con periodos previos y con los demas KPIs del bloque para evaluar desempeno."
          source={sourceLabel}
          calculation="Depende del endpoint del modulo y su agregacion interna."
        />
      </div>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{item.value}</p>
      {item.unit ? <p className="mt-1 text-xs text-slate-500">{item.unit}</p> : null}
      {item.delta ? (
        <p
          className={`mt-2 inline-flex rounded-full border border-current/30 bg-white px-2.5 py-1 text-xs font-medium ${trendColor}`}
        >
          {trendLabel ? `${trendLabel}: ${item.delta}` : item.delta}
        </p>
      ) : null}
      {item.helperText ? <p className="mt-2 text-xs text-slate-500">{item.helperText}</p> : null}
      <span className="mt-3 inline-flex rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-sm">
        Fuente: {sourceLabel}
      </span>
    </Card>
  );
}
