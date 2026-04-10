import { KpiCard } from '../components/common/KpiCard';
import { DataTable } from '../components/common/DataTable';
import { Card } from '../components/common/Card';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { DateRangeFilter } from '../components/common/DateRangeFilter';
import { DataSourceBadge } from '../components/common/DataSourceBadge';
import { PageIntro } from '../components/common/PageIntro';
import { SectionHeader } from '../components/common/SectionHeader';
import { InsightsPanel } from '../components/common/InsightsPanel';
import { BarChartWidget } from '../components/charts/BarChartWidget';
import { LineChartWidget } from '../components/charts/LineChartWidget';
import { PieChartWidget } from '../components/charts/PieChartWidget';
import { ExcelUploader } from '../components/telemetry/ExcelUploader';
import { useTelemetriaPage } from '../hooks/useTelemetriaPage';
import { formatSpeed } from '../utils/formatters';

function parseCount(value: string | number | undefined): number {
  if (typeof value === 'number') {
    return value;
  }

  if (!value) {
    return 0;
  }

  return Number(String(value).replace(/\./g, '').replace(',', '.')) || 0;
}

export function TelemetriaPage(): JSX.Element {
  const {
    loading,
    error,
    dateRange,
    kpis,
    speedTrend,
    alerts,
    securityEvents,
    corridorSummary,
    setDateRange,
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

  const periodLabel = `${dateRange.from} a ${dateRange.to}`;

  const alertsSorted = [...alerts].sort((a, b) => parseCount(b.count) - parseCount(a.count));
  const securitySorted = [...securityEvents].sort(
    (a, b) => parseCount(b.count) - parseCount(a.count),
  );

  const alertChart = alertsSorted.map((item) => ({
    label: String(item.type),
    value: parseCount(item.count),
  }));

  const securityChart = securitySorted.map((item) => ({
    label: String(item.event),
    value: parseCount(item.count),
  }));

  const topAlert = alertsSorted[0];
  const topSecurityEvent = securitySorted[0];
  const topCorridor = corridorSummary[0];

  const insightItems = [
    topCorridor
      ? {
          title: 'Corredor principal detectado',
          detail: `${String(topCorridor.segment)} concentra ${String(topCorridor.vehicles)} vehiculos y velocidad media de ${String(topCorridor.avgSpeed)} km/h.`,
          tone: 'neutral' as const,
        }
      : null,
    topAlert
      ? {
          title: 'Alerta dominante del periodo',
          detail: `${String(topAlert.type)} registra ${String(topAlert.count)} eventos y requiere seguimiento operativo.`,
          tone: 'warning' as const,
        }
      : null,
    topSecurityEvent
      ? {
          title: 'Evento de seguridad mas frecuente',
          detail: `${String(topSecurityEvent.event)} aparece ${String(topSecurityEvent.count)} veces en el periodo analizado.`,
          tone: 'warning' as const,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  const criticalCards = alertsSorted.slice(0, 3);

  const timeline = [...alertsSorted.slice(0, 4), ...securitySorted.slice(0, 4)]
    .map((item) => ({
      label: 'type' in item ? String(item.type) : String(item.event),
      count: String(item.count),
      score: parseCount(item.count),
      source: 'type' in item ? 'Alerta' : 'Seguridad',
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return (
    <section className="space-y-6 md:space-y-8">
      <DataSourceBadge module="Telemetria" />
      <PageIntro
        title="Centro Operativo de Telemetria"
        subtitle="Monitorea velocidad, alertas y eventos de seguridad para detectar riesgos en ruta y priorizar acciones de control."
        periodLabel={periodLabel}
        highlights={[
          'Comportamiento de velocidad',
          'Alertas criticas',
          'Eventos de seguridad',
          'Corredor principal',
        ]}
      />
      <DateRangeFilter value={dateRange} onChange={setDateRange} />
      <ExcelUploader onUpload={onUpload} />
      <SectionHeader
        title="KPIs operativos"
        description="Lectura rapida de desempeno de flota y variables de seguridad."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </div>
      <SectionHeader
        title="Alertas criticas"
        description="Top alertas para priorizar supervision y acciones preventivas."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {criticalCards.map((item) => (
          <Card key={String(item.type)} className="border-amber-900/70 bg-amber-950/25">
            <p className="text-xs uppercase tracking-wide text-amber-200">Riesgo detectado</p>
            <p className="mt-2 text-base font-semibold text-amber-100">{String(item.type)}</p>
            <p className="mt-1 text-2xl font-bold text-white">{String(item.count)}</p>
            <p className="mt-2 text-xs text-amber-100/80">Eventos observados en el periodo.</p>
          </Card>
        ))}
      </div>
      <SectionHeader
        title="Tendencia y zonas de riesgo"
        description="Compara evolucion de velocidad con concentracion de alertas y eventos."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <LineChartWidget
          title="Velocidad promedio"
          subtitle="Este grafico muestra la evolucion temporal de la velocidad media de la flota."
          data={speedTrend}
          dataKey="value"
          xKey="label"
          metricLabel="Velocidad promedio"
          valueFormatter={formatSpeed}
        />
        <BarChartWidget
          title="Ranking de alertas"
          subtitle="Top alertas por frecuencia para identificar focos de riesgo."
          data={alertChart}
          dataKey="value"
          xKey="label"
          horizontal
          sortDescending
          valueLabel="Eventos"
        />
      </div>

      <PieChartWidget
        title="Distribucion de alertas"
        subtitle="Participacion relativa de cada tipo de alerta en el periodo"
        data={alertChart}
        dataKey="value"
        nameKey="label"
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <BarChartWidget
          title="Eventos de seguridad"
          subtitle="Top eventos que afectan seguridad y continuidad operacional."
          data={securityChart}
          dataKey="value"
          xKey="label"
          horizontal
          sortDescending
          valueLabel="Eventos"
        />
        <Card title="Timeline operativo" className="border-slate-700/80 bg-slate-900/70">
          <p className="mb-3 text-xs text-slate-400">
            Secuencia priorizada por frecuencia de alertas y eventos de seguridad.
          </p>
          <ul className="space-y-2">
            {timeline.map((item) => (
              <li
                key={`${item.source}-${item.label}`}
                className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-100">{item.label}</p>
                  <span className="rounded-full border border-slate-600 px-2 py-0.5 text-[11px] text-slate-300">
                    {item.source}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">Frecuencia observada: {item.count}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <SectionHeader
        title="Detalle operativo"
        description="Tablas para revision puntual de corredores, alertas y eventos consolidados."
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <DataTable
          title="Corredor principal"
          subtitle="Segmentos con mayor flujo y su velocidad promedio."
          columns={[
            { key: 'segment', label: 'Segmento' },
            { key: 'vehicles', label: 'Vehiculos' },
            { key: 'avgSpeed', label: 'Velocidad Promedio' },
          ]}
          rows={corridorSummary}
          rowKey="segment"
          maxRows={6}
        />
        <DataTable
          title="Alertas"
          subtitle="Eventos operativos detectados por tipo."
          columns={[
            { key: 'type', label: 'Tipo' },
            { key: 'count', label: 'Cantidad' },
          ]}
          rows={alerts}
          rowKey="type"
          maxRows={6}
        />
        <DataTable
          title="Eventos de seguridad"
          subtitle="Eventos asociados a conducta de riesgo o fallos de operacion."
          columns={[
            { key: 'event', label: 'Evento' },
            { key: 'count', label: 'Cantidad' },
          ]}
          rows={securityEvents}
          rowKey="event"
          maxRows={6}
        />
      </div>
      <InsightsPanel title="Lectura de riesgo del periodo" items={insightItems} />
    </section>
  );
}
