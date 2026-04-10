import { type PropsWithChildren } from 'react';

import { Card } from '../common/Card';

type ChartCardProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export function ChartCard({ title, subtitle, children }: ChartCardProps): JSX.Element {
  return (
    <Card title={title}>
      {subtitle ? <p className="-mt-2 mb-3 text-xs text-slate-400">{subtitle}</p> : null}
      <div className="min-h-[320px] w-full">{children}</div>
    </Card>
  );
}
