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
      <EmptyState
        title="Sin telemetria"
        message="No hay datos disponibles para el rango seleccionado."
        source="RNDC publico /api/telemetry/*"
      />
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
      <DataSourceBadge
        module="Telemetria RNDC publica"
        sourceLabel="RNDC publico"
        sourceDetail="Registros de telemetria procesados por backend y expuestos por API publica"
        visibility="public"
      />
      <PageIntro
        title="Telemetria Publica RNDC"
        subtitle="Modulo para interpretar velocidad, alertas y eventos de seguridad con datos de telemetria publicados por el sistema RNDC."
        periodLabel={periodLabel}
        highlights={[
          'Que muestra: comportamiento de telemetria reportada',
          'Para que sirve: control operativo y riesgo',
          'Fuente: API publica de telemetria RNDC',
          'Alcance: analisis publico por rango de fechas',
        ]}
        moduleGuide={{
          summary:
            'Este modulo transforma la telemetria disponible en RNDC en indicadores de seguridad, alertas y desempeno operativo.',
          purpose:
            'Permite detectar riesgos tempranos, priorizar supervision y revisar corredores con mayor exposicion.',
          userType: 'Coordinadores de flota, analistas de seguridad y gerencia operativa.',
          source: 'Datos publicos de telemetria expuestos por backend en /api/telemetry/*.',
          analysisType:
            'Analisis operacional de tendencia, frecuencia de eventos y ranking de riesgos.',
          scope:
            'Cobertura sobre registros de telemetria disponibles para el periodo filtrado en la interfaz.',
          interpretation:
            'Combine velocidad promedio con alertas criticas para distinguir si el riesgo proviene de conducta o de contexto operativo.',
          limitations:
            'La calidad del analisis depende de la completitud y consistencia de los registros de telemetria publicados.',
          useCases: [
            'Seguimiento semanal de eventos criticos.',
            'Priorizacion de acciones de seguridad vial.',
            'Comparacion interna por corredores de mayor riesgo.',
          ],
        }}
      />
      <DateRangeFilter value={dateRange} onChange={setDateRange} />
      <SectionHeader
        title="KPIs operativos"
        description="Lectura rapida de desempeno de flota y variables de seguridad."
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {kpis.map((item) => (
          <KpiCard key={item.label} item={item} sourceLabel="RNDC publico" />
        ))}
      </div>
      <SectionHeader
        title="Alertas criticas"
        description="Top alertas para priorizar supervision y acciones preventivas."
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {criticalCards.map((item) => (
          <Card
            key={String(item.type)}
            className="border-amber-300 bg-gradient-to-b from-amber-50 to-white"
          >
            <p className="text-xs uppercase tracking-wide text-amber-800">Riesgo detectado</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{String(item.type)}</p>
            <p className="mt-1 text-2xl font-bold text-amber-900">{String(item.count)}</p>
            <p className="mt-2 text-xs text-slate-700">Eventos observados en el periodo.</p>
          </Card>
        ))}
      </div>
      <SectionHeader
        title="Tendencia y zonas de riesgo"
        description="Compara evolucion de velocidad con concentracion de alertas y eventos."
      />
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <LineChartWidget
          title="Velocidad promedio"
          subtitle="Este grafico muestra la evolucion temporal de la velocidad media de la flota."
          data={speedTrend}
          dataKey="value"
          xKey="label"
          metricLabel="Velocidad promedio"
          valueFormatter={formatSpeed}
          sourceLabel="RNDC publico"
          help={{
            description:
              'Evolucion temporal de la velocidad media calculada con registros GPS validos.',
            xAxis: 'Cortes temporales del periodo seleccionado.',
            yAxis: 'Velocidad promedio en km/h.',
            interpretation:
              'Cambios bruscos o niveles persistentemente altos pueden requerir revision de conducta y condiciones de ruta.',
          }}
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
          sourceLabel="RNDC publico"
          help={{
            description: 'Frecuencia de alertas para identificar tipos de riesgo dominantes.',
            xAxis: 'Cantidad de eventos.',
            yAxis: 'Tipo de alerta.',
            interpretation:
              'Las alertas con mayor frecuencia deben priorizarse en protocolos de seguimiento.',
          }}
        />
      </div>

      <PieChartWidget
        title="Distribucion de alertas"
        subtitle="Participacion relativa de cada tipo de alerta en el periodo"
        data={alertChart}
        dataKey="value"
        nameKey="label"
        sourceLabel="RNDC publico"
        help={{
          description: 'Participacion relativa de cada alerta dentro del total del periodo.',
          xAxis: 'Categorias de alerta.',
          yAxis: 'Porcentaje y volumen de eventos.',
          interpretation:
            'Una alta participacion de una categoria indica foco principal de intervencion operativa.',
        }}
      />

      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-[1.2fr_1fr]">
        <BarChartWidget
          title="Eventos de seguridad"
          subtitle="Top eventos que afectan seguridad y continuidad operacional."
          data={securityChart}
          dataKey="value"
          xKey="label"
          horizontal
          sortDescending
          valueLabel="Eventos"
          sourceLabel="RNDC publico"
          help={{
            description: 'Ranking de eventos que afectan la seguridad de operacion.',
            xAxis: 'Numero de eventos.',
            yAxis: 'Tipo de evento de seguridad.',
            interpretation:
              'Eventos superiores en frecuencia representan mayor exposicion y necesidad de control.',
          }}
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
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
          sourceLabel="Telemetria empresarial"
          helpText="Lista segmentos con mayor flujo y velocidad media para priorizar tramos de seguimiento."
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
          sourceLabel="Telemetria empresarial"
          helpText="Consolida alertas por tipo para entender concentracion de riesgo operacional."
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
          sourceLabel="Telemetria empresarial"
          helpText="Muestra eventos de seguridad para apoyar planes de mitigacion y capacitacion."
        />
      </div>
      <InsightsPanel title="Lectura de riesgo del periodo" items={insightItems} />
    </section>
  );
}
