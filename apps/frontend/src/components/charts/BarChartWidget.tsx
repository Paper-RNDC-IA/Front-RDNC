import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

import type { ChartDatum } from '../../types/common';
import { formatNumber } from '../../utils/formatters';
import { ChartCard } from './ChartCard';

type BarChartWidgetProps = {
  title: string;
  data: ChartDatum[];
  dataKey: string;
  xKey: string;
  subtitle?: string;
  horizontal?: boolean;
  sortDescending?: boolean;
  valueLabel?: string;
  maxItems?: number;
};

export function BarChartWidget({
  title,
  data,
  dataKey,
  xKey,
  subtitle,
  horizontal = false,
  sortDescending = false,
  valueLabel = 'Valor',
  maxItems = 8,
}: BarChartWidgetProps): JSX.Element {
  const chartData = (sortDescending ? [...data].sort((a, b) => b.value - a.value) : data).slice(
    0,
    maxItems,
  );

  if (!chartData.length) {
    return (
      <ChartCard title={title} subtitle={subtitle}>
        <div className="flex h-64 items-center justify-center rounded-xl border border-slate-700/70 bg-slate-900/40">
          <p className="text-sm text-slate-400">No hay datos para esta comparacion.</p>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title={title} subtitle={subtitle}>
      <div className="h-72 w-full">
        <ResponsiveContainer>
          <BarChart data={chartData} layout={horizontal ? 'vertical' : 'horizontal'}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            {horizontal ? (
              <>
                <XAxis type="number" stroke="#94a3b8" tickFormatter={formatNumber} />
                <YAxis type="category" dataKey={xKey} stroke="#94a3b8" width={120} />
                <Bar dataKey={dataKey} fill="#f97316" radius={[0, 6, 6, 0]} />
              </>
            ) : (
              <>
                <XAxis dataKey={xKey} stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={formatNumber} />
                <Bar dataKey={dataKey} fill="#f97316" radius={[6, 6, 0, 0]} />
              </>
            )}
            <Tooltip formatter={(value: number) => [formatNumber(value), valueLabel]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
