import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

import type { ChartDatum } from '../../types/common';
import { formatNumber } from '../../utils/formatters';
import { ChartCard } from './ChartCard';
import { ChartLegendHelp } from '../common/ChartLegendHelp';

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
  sourceLabel?: string;
  help?: {
    description: string;
    xAxis: string;
    yAxis: string;
    interpretation: string;
  };
};

// Sin animacion: las barras se dibujan con requestAnimationFrame, que el navegador pausa en
// pestanas en segundo plano, y html2canvas (exportacion a PDF) puede capturar el grafico a
// medio animar. Con isAnimationActive={false} el resultado es el mismo siempre.
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
  sourceLabel,
  help,
}: BarChartWidgetProps): JSX.Element {
  const chartData = (sortDescending ? [...data].sort((a, b) => b.value - a.value) : data).slice(
    0,
    maxItems,
  );

  if (!chartData.length) {
    return (
      <ChartCard title={title} subtitle={subtitle}>
        <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-200 bg-[#fffaf6]">
          <p className="text-sm text-slate-600">No hay datos para esta comparacion.</p>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title={title} subtitle={subtitle} sourceLabel={sourceLabel}>
      <div className="space-y-2.5">
        <div className="h-60 w-full">
          <ResponsiveContainer>
            <BarChart data={chartData} layout={horizontal ? 'vertical' : 'horizontal'}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              {/* Sin <>…</>: recharts 2.x usa react-is 18, que no reconoce los Fragments de React 19,
                  e ignora los ejes y las barras que van dentro (solo se dibujaba la cuadricula). */}
              {horizontal ? (
                <XAxis type="number" stroke="#64748b" tickFormatter={formatNumber} />
              ) : (
                <XAxis dataKey={xKey} stroke="#64748b" />
              )}
              {horizontal ? (
                <YAxis type="category" dataKey={xKey} stroke="#64748b" width={120} />
              ) : (
                <YAxis stroke="#64748b" tickFormatter={formatNumber} />
              )}
              <Bar
                dataKey={dataKey}
                fill="#f97316"
                radius={horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]}
                isAnimationActive={false}
              />
              <Tooltip
                formatter={(value: number) => [formatNumber(value), valueLabel]}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '10px',
                  boxShadow: '0 12px 22px rgba(15, 23, 42, 0.12)',
                }}
              />
            </BarChart>
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
