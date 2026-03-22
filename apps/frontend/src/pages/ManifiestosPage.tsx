import { KpiCard } from '../components/common/KpiCard';
import { DataTable } from '../components/common/DataTable';
import { DateRangeFilter } from '../components/common/DateRangeFilter';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { SectionLegend } from '../components/common/SectionLegend';
import { LineChartWidget } from '../components/charts/LineChartWidget';
import { PieChartWidget } from '../components/charts/PieChartWidget';
import { useManifiestosPage } from '../hooks/useManifiestosPage';

export function ManifiestosPage(): JSX.Element {
  const {
    loading,
    error,
    dateRange,
    kpis,
    trends,
    routeRanking,
    companyRanking,
    distribution,
    setDateRange,
    reload,
  } = useManifiestosPage();

  if (loading) {
    return <LoadingState title="Cargando modulo de manifiestos" />;
  }

  if (error) {
    return <ErrorState title="Error en manifiestos" message={error} onRetry={reload} />;
  }

  if (!kpis.length) {
    return (
      <EmptyState title="Sin manifiestos" message="No hay datos para el rango seleccionado." />
    );
  }

  return (
    <section className="space-y-6">
      <SectionLegend
        title="Leyenda de Manifiestos"
        items={[
          {
            label: 'Tendencia',
            description: 'Evolucion de manifiestos emitidos en el rango consultado.',
          },
          {
            label: 'Distribucion por estado',
            description: 'Participacion de cumplidos, en proceso y con novedad.',
          },
          {
            label: 'Ranking de rutas',
            description: 'Corredores con mayor uso y nivel de incidencias.',
          },
          {
            label: 'Ranking de empresas',
            description: 'Empresas con mayor volumen y cumplimiento reportado.',
          },
        ]}
      />
      <DateRangeFilter value={dateRange} onChange={setDateRange} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <LineChartWidget
          title="Tendencia de manifiestos"
          data={trends}
          dataKey="value"
          xKey="label"
        />
        <PieChartWidget
          title="Distribucion por estado"
          data={distribution}
          dataKey="value"
          nameKey="label"
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <DataTable
          title="Ranking de rutas"
          columns={[
            { key: 'route', label: 'Ruta' },
            { key: 'trips', label: 'Viajes' },
            { key: 'incidents', label: 'Novedades' },
          ]}
          rows={routeRanking}
          rowKey="route"
        />
        <DataTable
          title="Ranking de empresas"
          columns={[
            { key: 'company', label: 'Empresa' },
            { key: 'manifests', label: 'Manifiestos' },
            { key: 'compliance', label: 'Cumplimiento' },
          ]}
          rows={companyRanking}
          rowKey="company"
        />
      </div>
    </section>
  );
}
