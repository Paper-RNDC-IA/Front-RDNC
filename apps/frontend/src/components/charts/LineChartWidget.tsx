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
        <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-200 bg-[#ffffff]">
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
                  <stop offset="5%" stopColor="#e42b0c" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#e42b0c" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey={xKey}
                stroke="#4a5565"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#d4d4d4' }}
                minTickGap={20}
              />
              <YAxis
                stroke="#4a5565"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#d4d4d4' }}
                width={58}
              />
              <Tooltip
                cursor={{ stroke: '#ffb27a', strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e5e7eb',
                  borderRadius: '10px',
                  color: '#101828',
                  boxShadow: '0 12px 22px rgba(15, 23, 42, 0.12)',
                }}
                labelStyle={{ color: '#4a5565' }}
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
                stroke="#ff7802"
                strokeWidth={3}
                dot={{ r: 2, strokeWidth: 0, fill: '#ffb27a' }}
                activeDot={{ r: 5, fill: '#e42b0c', stroke: '#f5f5f5', strokeWidth: 2 }}
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
