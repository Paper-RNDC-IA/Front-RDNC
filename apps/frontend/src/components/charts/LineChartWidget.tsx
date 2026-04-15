import {
  Area,
  AreaChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

import type { ChartDatum } from '../../types/common';
import { formatDecimal, formatNumber } from '../../utils/formatters';
import { ChartCard } from './ChartCard';
import { ChartLegendHelp } from '../common/ChartLegendHelp';

type LineChartWidgetProps = {
  title: string;
  data: ChartDatum[];
  dataKey: string;
  xKey: string;
  subtitle?: string;
  metricLabel?: string;
  valueFormatter?: (value: number) => string;
  sourceLabel?: string;
  help?: {
    description: string;
    xAxis: string;
    yAxis: string;
    interpretation: string;
  };
};

export function LineChartWidget({
  title,
  data,
  dataKey,
  xKey,
  subtitle,
  metricLabel = 'Valor',
  valueFormatter = formatNumber,
  sourceLabel,
  help,
}: LineChartWidgetProps): JSX.Element {
  if (!data.length) {
    return (
      <ChartCard title={title} subtitle={subtitle}>
        <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-200 bg-[#fffaf6]">
          <p className="text-sm text-slate-600">
            No hay datos de tendencia para el rango seleccionado.
          </p>
        </div>
      </ChartCard>
    );
  }

  const maxValue = Math.max(...data.map((item) => item.value));
  const firstValue = data[0]?.value ?? 0;
  const lastValue = data[data.length - 1]?.value ?? 0;
  const variation = firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;

  return (
    <ChartCard title={title} subtitle={subtitle} sourceLabel={sourceLabel}>
      <div className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 shadow-sm">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Pico</p>
            <p className="text-sm font-semibold text-orange-700">{valueFormatter(maxValue)}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 shadow-sm">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Periodos</p>
            <p className="text-sm font-semibold text-slate-900">{data.length}</p>
          </div>
          <div className="col-span-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 shadow-sm sm:col-span-1">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Variacion</p>
            <p className="text-sm font-semibold text-orange-700">{formatDecimal(variation, 1)}%</p>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 12, right: 12, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="manifestsTrendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey={xKey}
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                minTickGap={20}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                width={58}
              />
              <Tooltip
                cursor={{ stroke: '#fdba74', strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '10px',
                  color: '#0f172a',
                  boxShadow: '0 12px 22px rgba(15, 23, 42, 0.12)',
                }}
                labelStyle={{ color: '#64748b' }}
                formatter={(value: number) => [valueFormatter(value), metricLabel]}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke="none"
                fill="url(#manifestsTrendFill)"
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#fb923c"
                strokeWidth={3}
                dot={{ r: 2, strokeWidth: 0, fill: '#fdba74' }}
                activeDot={{ r: 5, fill: '#f97316', stroke: '#ffedd5', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {help ? (
          <ChartLegendHelp
            description={help.description}
            xAxis={help.xAxis}
            yAxis={help.yAxis}
            interpretation={help.interpretation}
          />
        ) : null}
      </div>
    </ChartCard>
  );
}
