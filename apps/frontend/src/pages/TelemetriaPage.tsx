import { KpiCard } from '../components/common/KpiCard';
import { DataTable } from '../components/common/DataTable';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { DataSourceBadge } from '../components/common/DataSourceBadge';
import { SectionLegend } from '../components/common/SectionLegend';
import { LineChartWidget } from '../components/charts/LineChartWidget';
import { ExcelUploader } from '../components/telemetry/ExcelUploader';
import { useTelemetriaPage } from '../hooks/useTelemetriaPage';

export function TelemetriaPage(): JSX.Element {
  const {
    loading,
    error,
    kpis,
    speedTrend,
    alerts,
    securityEvents,
    corridorSummary,
    onUpload,
    reload,
  } = useTelemetriaPage();

  if (loading) {
    return <LoadingState title="Cargando telemetria GPS" />;
  }

  if (error) {
    return <ErrorState title="Error en telemetria" message={error} onRetry={reload} />;
  }

  if (!kpis.length) {
    return (
      <EmptyState title="Sin telemetria" message="Sube un archivo Excel o valida el backend." />
    );
  }

  return (
    <section className="space-y-6">
      <DataSourceBadge
        module="Telemetria"
        endpoints={[
          '/api/telemetry/kpis',
          '/api/telemetry/speeds',
          '/api/telemetry/corridor',
          '/api/telemetry/alerts',
          '/api/telemetry/events',
        ]}
      />
      <SectionLegend
        title="Leyenda de Telemetria"
        items={[
          {
            label: 'Carga de Excel',
            description: 'Permite inyectar mediciones para procesamiento operacional.',
          },
          {
            label: 'Velocidad promedio',
            description: 'Comportamiento de velocidad por franja de tiempo.',
          },
          {
            label: 'Corredor principal',
            description: 'Resumen de flujo vehicular y velocidad por segmento.',
          },
          {
            label: 'Alertas y eventos',
            description: 'Incidencias de seguridad y estado de atencion.',
          },
        ]}
      />
      <ExcelUploader onUpload={onUpload} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <LineChartWidget
          title="Velocidad promedio"
          data={speedTrend}
          dataKey="value"
          xKey="label"
        />
        <DataTable
          title="Corredor principal"
          columns={[
            { key: 'segment', label: 'Segmento' },
            { key: 'vehicles', label: 'Vehiculos' },
            { key: 'avgSpeed', label: 'Velocidad Promedio' },
          ]}
          rows={corridorSummary}
          rowKey="segment"
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <DataTable
          title="Alertas"
          columns={[
            { key: 'type', label: 'Tipo' },
            { key: 'count', label: 'Cantidad' },
            { key: 'severity', label: 'Severidad' },
          ]}
          rows={alerts}
          rowKey="type"
        />
        <DataTable
          title="Eventos de seguridad"
          columns={[
            { key: 'event', label: 'Evento' },
            { key: 'count', label: 'Cantidad' },
            { key: 'status', label: 'Estado' },
          ]}
          rows={securityEvents}
          rowKey="event"
        />
      </div>
    </section>
  );
}
