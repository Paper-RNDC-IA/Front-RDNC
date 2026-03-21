import { KpiCard } from '../components/common/KpiCard';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { DateRangeFilter } from '../components/common/DateRangeFilter';
import { LineChartWidget } from '../components/charts/LineChartWidget';
import { BarChartWidget } from '../components/charts/BarChartWidget';
import { useStatsPage } from '../hooks/useStatsPage';

export function EstadisticasPage(): JSX.Element {
  const {
    loading,
    error,
    dateRange,
    kpis,
    trendChart,
    summaryChart,
    setDateRange,
    reload,
  } = useStatsPage();

  if (loading) {
    return <LoadingState title="Cargando dashboard estrategico" />;
  }

  if (error) {
    return <ErrorState title="No fue posible cargar estadisticas" message={error} onRetry={reload} />;
  }

  if (!kpis.length) {
    return <EmptyState title="Sin datos para estadisticas" message="Verifica los filtros o la fuente de datos." />;
  }

  return (
    <section className="space-y-6">
      <DateRangeFilter value={dateRange} onChange={setDateRange} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <LineChartWidget title="Tendencia operativa" data={trendChart} dataKey="value" xKey="label" />
        <BarChartWidget title="Resumen por modulo" data={summaryChart} dataKey="value" xKey="label" />
      </div>
    </section>
  );
}
