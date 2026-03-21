import { type PropsWithChildren } from 'react';

import { Card } from '../common/Card';

type ChartCardProps = PropsWithChildren<{
  title: string;
}>;

export function ChartCard({ title, children }: ChartCardProps): JSX.Element {
  return (
    <Card title={title}>
      <div className="h-72 w-full">{children}</div>
    </Card>
  );
}
