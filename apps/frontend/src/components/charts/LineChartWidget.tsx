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
import { ChartCard } from './ChartCard';

type LineChartWidgetProps = {
  title: string;
  data: ChartDatum[];
  dataKey: string;
  xKey: string;
};

export function LineChartWidget({ title, data, dataKey, xKey }: LineChartWidgetProps): JSX.Element {
  if (!data.length) {
    return (
      <ChartCard title={title}>
        <div className="flex h-64 items-center justify-center rounded-xl border border-slate-700/70 bg-slate-900/40">
          <p className="text-sm text-slate-400">No hay datos de tendencia para el rango seleccionado.</p>
        </div>
      </ChartCard>
    );
  }

  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <ChartCard title={title}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-700/70 bg-slate-900/45 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Pico</p>
            <p className="text-sm font-semibold text-orange-200">{maxValue.toLocaleString('es-CO')}</p>
          </div>
          <div className="rounded-lg border border-slate-700/70 bg-slate-900/45 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Periodos</p>
            <p className="text-sm font-semibold text-slate-100">{data.length}</p>
          </div>
          <div className="rounded-lg border border-slate-700/70 bg-slate-900/45 px-3 py-2 sm:col-span-1 col-span-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Ultimo valor</p>
            <p className="text-sm font-semibold text-emerald-300">
              {data[data.length - 1].value.toLocaleString('es-CO')}
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 12, right: 12, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="manifestsTrendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#334155" vertical={false} />
              <XAxis
                dataKey={xKey}
                stroke="#94a3b8"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                minTickGap={20}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                width={58}
              />
              <Tooltip
                cursor={{ stroke: '#fdba74', strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#475569',
                  borderRadius: '10px',
                  color: '#f8fafc',
                }}
                labelStyle={{ color: '#cbd5e1' }}
                formatter={(value: number) => [value.toLocaleString('es-CO'), 'Manifiestos']}
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
      </div>
    </ChartCard>
  );
}
