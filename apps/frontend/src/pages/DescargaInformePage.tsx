import { useState } from 'react';

import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { DateRangeFilter } from '../components/common/DateRangeFilter';
import { ModuleFilter } from '../components/common/ModuleFilter';
import { DataSourceBadge } from '../components/common/DataSourceBadge';
import { PageIntro } from '../components/common/PageIntro';
import { SectionHeader } from '../components/common/SectionHeader';
import { InsightsPanel } from '../components/common/InsightsPanel';
import { BarChartWidget } from '../components/charts/BarChartWidget';
import { PieChartWidget } from '../components/charts/PieChartWidget';
import { ExportActions } from '../components/exports/ExportActions';
import { useDescargaInformePage } from '../hooks/useDescargaInformePage';

function parseSummaryValue(value: string | number): number {
  if (typeof value === 'number') {
    return value;
  }

  return (
    Number(
      String(value)
        .replace(/[^\d,.-]/g, '')
        .replace(/\./g, '')
        .replace(',', '.'),
    ) || 0
  );
}

export function DescargaInformePage(): JSX.Element {
  const [module, setModule] = useState('all');
  const {
    loading,
    error,
    dateRange,
    setDateRange,
    summary,
    exportCsv,
    exportExcel,
    exportPdf,
    reload,
  } = useDescargaInformePage(module);

  if (loading) {
    return <LoadingState title="Preparando modulo de exportacion" />;
  }

  if (error) {
    return <ErrorState title="Error en exportacion" message={error} onRetry={reload} />;
  }

  if (!summary.length) {
    return (
      <EmptyState
        title="Sin datos para exportar"
        message="Selecciona un modulo o rango con informacion."
      />
    );
  }

  const periodLabel = `${dateRange.from} a ${dateRange.to}`;
  const topSummary = summary[0];
  const summaryChartData = summary
    .map((item) => ({
      label: item.label,
      value: parseSummaryValue(item.value),
    }))
    .filter((item) => item.value > 0);

  const insightItems = [
    {
      title: 'Exportacion lista para ejecutar',
      detail: `Se exportara el modulo ${module === 'all' ? 'consolidado' : module} con el rango filtrado del periodo.`,
      tone: 'neutral' as const,
    },
    topSummary
      ? {
          title: 'Dato con mayor volumen',
          detail: `${topSummary.label} reporta ${topSummary.value} registros listos para salida.`,
          tone: 'positive' as const,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <section className="space-y-6 md:space-y-8">
      <DataSourceBadge module="Descarga Informe" />
      <PageIntro
        title="Centro de Exportacion"
        subtitle="Define modulo, rango y formato para generar reportes listos para auditoria, analisis o seguimiento operativo."
        periodLabel={periodLabel}
        highlights={['Seleccion por modulo', 'Filtros por fecha', 'Exportacion CSV, Excel y PDF']}
      />
      <SectionHeader
        title="Configuracion de exporte"
        description="Primero selecciona filtros, luego elige formato de salida para descargar el informe."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
        <ModuleFilter value={module} onChange={setModule} />
      </div>
      <ExportActions
        onExportCsv={exportCsv}
        onExportExcel={exportExcel}
        onExportPdf={exportPdf}
        module={module}
        dateRange={dateRange}
      />
      <SectionHeader
        title="Resumen a exportar"
        description="Vista rapida de lo que sera incluido en el archivo final."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <BarChartWidget
          title="Volumen por categoria exportable"
          subtitle="Comparacion de registros listos para exportar"
          data={summaryChartData}
          dataKey="value"
          xKey="label"
          horizontal
          sortDescending
          valueLabel="Registros"
        />
        <PieChartWidget
          title="Participacion del reporte"
          subtitle="Distribucion porcentual de los datos que saldran en el informe"
          data={summaryChartData}
          dataKey="value"
          nameKey="label"
        />
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-sm font-semibold text-slate-100">
          Resumen de datos listos para exportacion
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {summary.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between rounded-lg bg-slate-950/60 px-3 py-2"
            >
              <span>{item.label}</span>
              <span className="font-medium text-orange-300">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
      <InsightsPanel title="Contexto de salida" items={insightItems} />
    </section>
  );
}
