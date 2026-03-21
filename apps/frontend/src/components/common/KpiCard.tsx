import type { KpiItem } from '../../types/common';
import { Card } from './Card';

type KpiCardProps = {
  item: KpiItem;
};

export function KpiCard({ item }: KpiCardProps): JSX.Element {
  const trendColor =
    item.trend === 'up'
      ? 'text-emerald-300'
      : item.trend === 'down'
        ? 'text-rose-300'
        : 'text-slate-300';

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-900/50">
      <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-50">{item.value}</p>
      {item.delta ? <p className={`mt-1 text-xs ${trendColor}`}>{item.delta}</p> : null}
      {item.helperText ? <p className="mt-2 text-xs text-slate-500">{item.helperText}</p> : null}
    </Card>
  );
}
