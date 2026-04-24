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
      className="border-[#d2daeb] bg-gradient-to-b from-white to-[#f8fbff]"
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
      {subtitle ? <p className="-mt-1 mb-4 text-xs text-[#5a759c]">{subtitle}</p> : null}
      <div className="min-h-[220px] w-full sm:min-h-[260px] md:min-h-[300px]">{children}</div>
    </Card>
  );
}
