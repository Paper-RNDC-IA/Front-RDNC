import { useState } from 'react';

import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { DateRangeFilter } from '../components/common/DateRangeFilter';
import { ModuleFilter } from '../components/common/ModuleFilter';
import { SectionLegend } from '../components/common/SectionLegend';
import { ExportActions } from '../components/exports/ExportActions';
import { useDescargaInformePage } from '../hooks/useDescargaInformePage';

export function DescargaInformePage(): JSX.Element {
  const [module, setModule] = useState('all');
  const { loading, error, dateRange, setDateRange, summary, exportCsv, exportExcel, exportPdf, reload } =
    useDescargaInformePage(module);

  if (loading) {
    return <LoadingState title="Preparando modulo de exportacion" />;
  }

  if (error) {
    return <ErrorState title="Error en exportacion" message={error} onRetry={reload} />;
  }

  if (!summary.length) {
    return <EmptyState title="Sin datos para exportar" message="Selecciona un modulo o rango con informacion." />;
  }

  return (
    <section className="space-y-6">
      <SectionLegend
        title="Leyenda de Descarga Informe"
        items={[
          { label: 'Rango de fechas', description: 'Delimita el periodo para consolidar el reporte.' },
          { label: 'Filtro de modulo', description: 'Define si exportas todo o solo un modulo puntual.' },
          { label: 'Exportaciones', description: 'Genera salida en CSV, Excel o PDF con los datos filtrados.' },
          { label: 'Resumen listo', description: 'Conteo de registros y totales previos a la descarga.' },
        ]}
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
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-sm font-semibold text-slate-100">Resumen de datos listos para exportacion</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {summary.map((item) => (
            <li key={item.label} className="flex items-center justify-between rounded-lg bg-slate-950/60 px-3 py-2">
              <span>{item.label}</span>
              <span className="font-medium text-orange-300">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
