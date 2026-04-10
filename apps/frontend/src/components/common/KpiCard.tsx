import type { KpiItem } from '../../types/common';
import { Card } from './Card';

type KpiCardProps = {
  item: KpiItem;
};

export function KpiCard({ item }: KpiCardProps): JSX.Element {
  const trendLabel =
    item.trend === 'up' ? 'En aumento' : item.trend === 'down' ? 'En descenso' : '';
  const trendColor =
    item.trend === 'up'
      ? 'text-emerald-200'
      : item.trend === 'down'
        ? 'text-rose-200'
        : 'text-slate-200';

  return (
    <Card className="border-slate-700/80 bg-gradient-to-br from-slate-800 to-slate-900/80">
      <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-50">{item.value}</p>
      {item.unit ? <p className="mt-1 text-xs text-slate-400">{item.unit}</p> : null}
      {item.delta ? (
        <p
          className={`mt-2 inline-flex rounded-full border border-current/30 bg-slate-950/60 px-2 py-1 text-xs ${trendColor}`}
        >
          {trendLabel ? `${trendLabel}: ${item.delta}` : item.delta}
        </p>
      ) : null}
      {item.helperText ? <p className="mt-2 text-xs text-slate-400">{item.helperText}</p> : null}
    </Card>
  );
}
