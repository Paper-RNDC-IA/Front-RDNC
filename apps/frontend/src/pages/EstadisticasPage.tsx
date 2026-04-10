import { KpiCard } from '../components/common/KpiCard';
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
  const { loading, error, updatedAt, healthStatus, kpis, trendChart, summaryChart, reload } =
    useStatsPage();

  if (loading) {
    return <LoadingState title="Cargando dashboard estrategico" />;
  }

  if (error) {
    return (
      <ErrorState title="No fue posible cargar estadisticas" message={error} onRetry={reload} />
    );
  }

  if (!kpis.length) {
    return (
      <EmptyState
        title="Sin datos para estadisticas"
        message="El backend no retorno datos consolidados para el dashboard."
      />
    );
  }

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
    <section className="space-y-6 md:space-y-8">
      <DataSourceBadge module="Estadisticas" />
      <PageIntro
        title="Dashboard Ejecutivo"
        subtitle="Vista consolidada del estado global del sistema con datos directos de /api/stats/dashboard."
        periodLabel={periodLabel}
        highlights={[
          'KPIs de alto nivel',
          'Estado de salud del modulo',
          'Comparativo por modulos',
          `Health API: ${healthStatus ?? 'no disponible'}`,
        ]}
      />
      <SectionHeader
        title="KPIs principales"
        description="Estos indicadores resumen volumen y estado operativo global sin filtros de fecha en query params."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </div>
      <SectionHeader
        title="Visualizaciones"
        description="Cada grafico responde una pregunta clave para la toma de decisiones."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <LineChartWidget
          title="Tendencia operativa"
          subtitle="Serie temporal reportada por el backend en /stats/dashboard"
          data={trendChart}
          dataKey="value"
          xKey="label"
          metricLabel="Registros"
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
        />
      </div>
      <PieChartWidget
        title="Participacion por modulo"
        subtitle="Como se distribuye el volumen total entre modulos"
        data={summaryDistribution}
        dataKey="value"
        nameKey="label"
      />
      <InsightsPanel title="Insights rapidos" items={insightItems} />
    </section>
  );
}
