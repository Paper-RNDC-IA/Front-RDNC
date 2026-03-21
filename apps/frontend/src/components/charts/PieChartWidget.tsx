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

export function PieChartWidget({ title, data, dataKey, nameKey }: PieChartWidgetProps): JSX.Element {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer>
        <PieChart>
          <Tooltip />
          <Pie data={data} dataKey={dataKey} nameKey={nameKey} outerRadius={110} fill="#ea580c">
            {data.map((entry) => (
              <Cell key={entry.label} fill={colors[Math.abs(entry.label.length) % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
