import { type PropsWithChildren } from 'react';

import { Card } from '../common/Card';
import { MetricInfoTooltip } from '../common/MetricInfoTooltip';

type ChartCardProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  sourceLabel?: string;
  helpText?: string;
}>;

export function ChartCard({
  title,
  subtitle,
  sourceLabel,
  helpText,
  children,
}: ChartCardProps): JSX.Element {
  return (
    <Card
      title={title}
      className="bg-gradient-to-b from-white to-[#fffcf9]"
      actions={
        <div className="flex items-center gap-2">
          {sourceLabel ? null : null}
          {helpText ? (
            <MetricInfoTooltip
              label={`Ayuda: ${title}`}
              meaning={helpText}
              interpretation="Revisa la relacion entre ejes, categoria dominante y tendencia para extraer hallazgos accionables."
            />
          ) : null}
        </div>
      }
    >
      {subtitle ? <p className="-mt-1 mb-4 text-xs text-slate-600">{subtitle}</p> : null}
      <div className="min-h-[260px] w-full">{children}</div>
    </Card>
  );
}
