import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { ChartDatum } from '../../types/common';
import { formatNumber } from '../../utils/formatters';
import { ChartCard } from './ChartCard';
import { ChartLegendHelp } from '../common/ChartLegendHelp';

type PieChartWidgetProps = {
  title: string;
  data: ChartDatum[];
  dataKey: string;
  nameKey: string;
  subtitle?: string;
  sourceLabel?: string;
  help?: {
    description: string;
    xAxis: string;
    yAxis: string;
    interpretation: string;
  };
};

const colors = ['#ea580c', '#f97316', '#fb923c', '#f59e0b', '#fdba74'];

export function PieChartWidget({
  title,
  data,
  dataKey,
  nameKey,
  subtitle,
  sourceLabel,
  help,
}: PieChartWidgetProps): JSX.Element {
  if (!data.length) {
    return (
      <ChartCard title={title} subtitle={subtitle}>
        <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-200 bg-[#fffaf6]">
          <p className="text-sm text-slate-600">
            No hay distribucion disponible para este periodo.
          </p>
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

  if (chartData.length > 6) {
    const sorted = [...chartData].sort((a, b) => b.value - a.value).slice(0, 8);

    return (
      <ChartCard
        title={title}
        sourceLabel={sourceLabel}
        subtitle={
          subtitle ?? 'El numero de categorias es alto, por eso se muestra ranking horizontal.'
        }
      >
        <div className="space-y-3">
          <ResponsiveContainer>
            <BarChart data={sorted} layout="vertical" margin={{ left: 8 }}>
              <XAxis type="number" stroke="#64748b" tickFormatter={formatNumber} />
              <YAxis type="category" dataKey="label" width={120} stroke="#64748b" />
              <Tooltip
                formatter={(value: number) => [formatNumber(value), 'Volumen']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '10px',
                  boxShadow: '0 12px 22px rgba(15, 23, 42, 0.12)',
                }}
              />
              <Bar dataKey="value" fill="#f97316" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>

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

  return (
    <ChartCard title={title} subtitle={subtitle} sourceLabel={sourceLabel}>
      <div className="space-y-3">
        <div className="h-56 w-full">
          <ResponsiveContainer>
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '10px',
                  color: '#0f172a',
                  boxShadow: '0 12px 22px rgba(15, 23, 42, 0.12)',
                }}
                formatter={(
                  value: number,
                  _name: string,
                  item: { payload?: { percent?: number } },
                ) => {
                  const percent = item?.payload?.percent ?? 0;
                  return [`${formatNumber(value)} (${percent.toFixed(1)}%)`, 'Participacion'];
                }}
              />
              <Pie
                data={chartData}
                dataKey={dataKey}
                nameKey={nameKey}
                innerRadius={72}
                outerRadius={98}
                paddingAngle={2}
                stroke="#ffffff"
                strokeWidth={2}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Pie>
              <text x="50%" y="47%" textAnchor="middle" className="fill-slate-500 text-[11px]">
                Total
              </text>
              <text
                x="50%"
                y="56%"
                textAnchor="middle"
                className="fill-orange-700 text-sm font-semibold"
              >
                {formatNumber(total)}
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
                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-700">{item.label}</span>
                </div>
                <span className="font-semibold text-orange-700">{item.percent.toFixed(1)}%</span>
              </div>
            ))}
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
