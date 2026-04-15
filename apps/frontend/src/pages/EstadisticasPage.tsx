import { KpiCard } from '../components/common/KpiCard';
import { DateRangeFilter } from '../components/common/DateRangeFilter';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { DataSourceBadge } from '../components/common/DataSourceBadge';
import { PageIntro } from '../components/common/PageIntro';
import { SectionHeader } from '../components/common/SectionHeader';
import { InsightsPanel } from '../components/common/InsightsPanel';
import { LineChartWidget } from '../components/charts/LineChartWidget';
import { BarChartWidget } from '../components/charts/BarChartWidget';
import { PieChartWidget } from '../components/charts/PieChartWidget';
import { useStatsPage } from '../hooks/useStatsPage';
import { formatNumber } from '../utils/formatters';

export function EstadisticasPage(): JSX.Element {
  const {
    loading,
    error,
    dateRange,
    updatedAt,
    healthStatus,
    kpis,
    trendChart,
    summaryChart,
    setDateRange,
    reload,
  } = useStatsPage();

  const isInitialLoading = loading && !kpis.length;

  if (isInitialLoading) {
    return <LoadingState title="Cargando dashboard estrategico" />;
  }
  const hasData = kpis.length > 0;

  const periodLabel = updatedAt
    ? new Date(updatedAt).toLocaleString('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Actualizacion no informada';
  const topModule = [...summaryChart].sort((a, b) => b.value - a.value)[0];
  const summaryDistribution = summaryChart.filter((item) => item.value > 0);
  const firstTrend = trendChart[0]?.value ?? 0;
  const lastTrend = trendChart[trendChart.length - 1]?.value ?? 0;
  const trendDirection = lastTrend >= firstTrend ? 'crecio' : 'cayo';
  const trendDelta = firstTrend > 0 ? Math.abs(((lastTrend - firstTrend) / firstTrend) * 100) : 0;
  const hasTrend = trendChart.length > 1;

  const insightItems = [
    {
      title: 'Estado general del periodo',
      detail: hasTrend
        ? `La actividad total ${trendDirection} ${trendDelta.toFixed(1)}% frente al inicio de la serie disponible.`
        : 'El backend no reporta serie temporal en /stats/dashboard para este momento.',
      tone: hasTrend
        ? lastTrend >= firstTrend
          ? ('positive' as const)
          : ('warning' as const)
        : ('neutral' as const),
    },
    topModule
      ? {
          title: 'Modulo con mayor volumen',
          detail: `${topModule.label} lidera con ${formatNumber(topModule.value)} registros consolidados.`,
          tone: 'neutral' as const,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <section className="space-y-5 md:space-y-6">
      <DataSourceBadge
        module="Estadisticas nacionales"
        sourceLabel="RNDC publico"
        sourceDetail="Datos agregados desde endpoints de estadisticas del backend"
        visibility="public"
      />
      <PageIntro
        title="Panel de Estadisticas Publicas RNDC"
        subtitle="Vista consolidada para entender el comportamiento nacional del transporte de carga con datos publicos procesados por el sistema."
        periodLabel={periodLabel}
        highlights={[
          'Que esta viendo: resumen nacional RNDC',
          'Para que sirve: diagnostico general rapido',
          'Origen: RNDC publico + ETL del sistema',
          `Health API: ${healthStatus ?? 'no disponible'}`,
        ]}
        moduleGuide={{
          summary:
            'Este modulo presenta estadisticas publicas del RNDC para mostrar el estado general del transporte de carga terrestre en Colombia.',
          purpose:
            'Permite una lectura ejecutiva del comportamiento global antes de profundizar en manifiestos, empresas o telemetria.',
          userType: 'Docentes, evaluadores, analistas y tomadores de decision.',
          source: 'RNDC publico expuesto por backend en /api/stats/dashboard.',
          analysisType: 'Analisis descriptivo agregado por modulo y tendencia temporal.',
          scope: 'Cobertura nacional con corte al ultimo procesamiento disponible.',
          interpretation:
            'Observe primero KPIs, luego tendencia y finalmente distribucion por modulo para identificar concentraciones o cambios relevantes.',
          limitations:
            'La granularidad depende de la actualizacion del backend y de la disponibilidad de la fuente RNDC.',
          useCases: [
            'Presentar estado general en sustentacion academica.',
            'Detectar modulos con mayor actividad.',
            'Comparar periodos de forma exploratoria.',
          ],
        }}
      />
      <DateRangeFilter value={dateRange} onChange={setDateRange} />
      {error ? (
        <ErrorState title="No fue posible cargar estadisticas" message={error} onRetry={reload} />
      ) : null}
      {!error && !hasData ? (
        <EmptyState
          title="Sin datos para estadisticas"
          message="El backend no retorno datos consolidados para el dashboard."
          source="RNDC publico /api/stats/dashboard"
        />
      ) : null}
      {!error && hasData ? (
        <>
      <SectionHeader
        title="KPIs principales"
        description="Estos indicadores resumen volumen y estado operativo global para el rango de fechas consultado."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <KpiCard key={item.label} item={item} sourceLabel="RNDC publico" />
        ))}
      </div>
      <SectionHeader
        title="Visualizaciones"
        description="Cada grafico responde una pregunta clave para la toma de decisiones."
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <LineChartWidget
          title="Tendencia operativa"
          subtitle="Serie temporal reportada por el backend en /stats/dashboard"
          data={trendChart}
          dataKey="value"
          xKey="label"
          metricLabel="Registros"
          sourceLabel="RNDC publico"
          help={{
            description: 'Muestra la evolucion temporal del volumen total reportado por el backend.',
            xAxis: 'Periodos o cortes temporales reportados.',
            yAxis: 'Cantidad de registros agregados.',
            interpretation:
              'Una pendiente ascendente indica crecimiento de actividad; descendente sugiere contraccion frente al inicio del periodo.',
          }}
        />
        <BarChartWidget
          title="Resumen por modulo"
          subtitle="Que modulos concentran mas actividad"
          data={summaryChart}
          dataKey="value"
          xKey="label"
          sortDescending
          horizontal
          valueLabel="Registros"
          sourceLabel="RNDC publico"
          help={{
            description: 'Compara modulos para identificar donde se concentra la mayor actividad.',
            xAxis: 'Volumen de registros.',
            yAxis: 'Modulo analitico.',
            interpretation:
              'Las barras mas largas indican los modulos dominantes del periodo y ayudan a priorizar analisis.',
          }}
        />
      </div>
      <PieChartWidget
        title="Participacion por modulo"
        subtitle="Como se distribuye el volumen total entre modulos"
        data={summaryDistribution}
        dataKey="value"
        nameKey="label"
        sourceLabel="RNDC publico"
        help={{
          description: 'Presenta el peso relativo de cada modulo sobre el total de registros.',
          xAxis: 'Categorias de modulo.',
          yAxis: 'Participacion porcentual y volumen.',
          interpretation:
            'Categorias con mayor porcentaje representan la mayor contribucion al total consolidado.',
        }}
      />
      <InsightsPanel title="Insights rapidos" items={insightItems} />
        </>
      ) : null}
    </section>
  );
}
