import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import type { ChartDatum } from '../../types/common';
import { ChartCard } from './ChartCard';

type PieChartWidgetProps = {
  title: string;
  data: ChartDatum[];
  dataKey: string;
  nameKey: string;
};

const colors = ['#ea580c', '#f97316', '#fb923c', '#f59e0b', '#fdba74'];

export function PieChartWidget({
  title,
  data,
  dataKey,
  nameKey,
}: PieChartWidgetProps): JSX.Element {
  if (!data.length) {
    return (
      <ChartCard title={title}>
        <div className="flex h-64 items-center justify-center rounded-xl border border-slate-700/70 bg-slate-900/40">
          <p className="text-sm text-slate-400">No hay distribucion disponible para este periodo.</p>
        </div>
      </ChartCard>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const chartData = data.map((item, index) => ({
    ...item,
    color: colors[index % colors.length],
    percent: total > 0 ? (item.value / total) * 100 : 0,
  }));

  return (
    <ChartCard title={title}>
      <div className="space-y-4">
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#475569',
                  borderRadius: '10px',
                  color: '#f8fafc',
                }}
                formatter={(value: number, _name: string, item: { payload?: { percent?: number } }) => {
                  const percent = item?.payload?.percent ?? 0;
                  return [
                    `${value.toLocaleString('es-CO')} (${percent.toFixed(1)}%)`,
                    'Participacion',
                  ];
                }}
              />
              <Pie
                data={chartData}
                dataKey={dataKey}
                nameKey={nameKey}
                innerRadius={72}
                outerRadius={98}
                paddingAngle={2}
                stroke="#0f172a"
                strokeWidth={2}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Pie>
              <text x="50%" y="47%" textAnchor="middle" className="fill-slate-300 text-[11px]">
                Total
              </text>
              <text x="50%" y="56%" textAnchor="middle" className="fill-orange-200 text-sm font-semibold">
                {total.toLocaleString('es-CO')}
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {chartData
            .sort((a, b) => b.value - a.value)
            .slice(0, 6)
            .map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg border border-slate-700/70 bg-slate-900/45 px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-200">{item.label}</span>
                </div>
                <span className="font-semibold text-orange-200">{item.percent.toFixed(1)}%</span>
              </div>
            ))}
        </div>
      </div>
    </ChartCard>
  );
}
