import { KpiCard } from '../components/common/KpiCard';
import { DataTable } from '../components/common/DataTable';
import { DateRangeFilter } from '../components/common/DateRangeFilter';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { DataSourceBadge } from '../components/common/DataSourceBadge';
import { PageIntro } from '../components/common/PageIntro';
import { SectionHeader } from '../components/common/SectionHeader';
import { InsightsPanel } from '../components/common/InsightsPanel';
import { BarChartWidget } from '../components/charts/BarChartWidget';
import { LineChartWidget } from '../components/charts/LineChartWidget';
import { PieChartWidget } from '../components/charts/PieChartWidget';
import { useManifiestosPage } from '../hooks/useManifiestosPage';
import { formatNumber } from '../utils/formatters';

function parseTableNumber(value: string | number): number {
  if (typeof value === 'number') {
    return value;
  }

  return Number(String(value).replace(/\./g, '').replace(',', '.')) || 0;
}

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

  const periodLabel = `${dateRange.from} a ${dateRange.to}`;
  const topRoute = routeRanking[0];
  const topCompany = companyRanking[0];
  const topDistribution = [...distribution].sort((a, b) => b.value - a.value)[0];
  const routeBarData = routeRanking.map((row) => ({
    label: String(row.route),
    value: parseTableNumber(row.trips),
  }));

  const insightItems = [
    topRoute
      ? {
          title: 'Corredor con mayor actividad',
          detail: `${String(topRoute.route)} concentra ${String(topRoute.trips)} viajes reportados.`,
          tone: 'neutral' as const,
        }
      : null,
    topCompany
      ? {
          title: 'Empresa lider del periodo',
          detail: `${String(topCompany.company)} registra ${String(topCompany.manifests)} manifiestos.`,
          tone: 'positive' as const,
        }
      : null,
    topDistribution
      ? {
          title: 'Concentracion principal',
          detail: `La categoria ${topDistribution.label} concentra ${formatNumber(topDistribution.value)} registros.`,
          tone: 'warning' as const,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <section className="space-y-6 md:space-y-8">
      <DataSourceBadge module="Manifiestos" />
      <PageIntro
        title="Analitica de Manifiestos"
        subtitle="Lectura ejecutiva de volumen, rutas y empresas para entender dinamica de carga y cumplimiento operativo."
        periodLabel={periodLabel}
        highlights={[
          'Top rutas por viajes',
          'Top empresas por manifiestos',
          'Evolucion temporal',
          'Distribucion por categoria',
        ]}
      />
      <DateRangeFilter value={dateRange} onChange={setDateRange} />
      <SectionHeader
        title="KPIs del modulo"
        description="Indicadores clave para seguimiento del volumen y comportamiento de manifiestos."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </div>
      <SectionHeader
        title="Tendencia y composicion"
        description="Este bloque muestra como cambia el volumen y en que categorias se concentra."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <LineChartWidget
          title="Tendencia de manifiestos"
          subtitle="Como evoluciona el total de manifiestos por periodo"
          data={trends}
          dataKey="value"
          xKey="label"
          metricLabel="Manifiestos"
        />
        <PieChartWidget
          title="Distribucion por categoria"
          subtitle="Que tipo de registros concentra mayor volumen"
          data={distribution}
          dataKey="value"
          nameKey="label"
        />
      </div>
      <BarChartWidget
        title="Ranking visual de rutas"
        subtitle="Top corredores por viajes para lectura rapida"
        data={routeBarData}
        dataKey="value"
        xKey="label"
        horizontal
        sortDescending
        valueLabel="Viajes"
      />
      <SectionHeader
        title="Rankings"
        description="Compara corredores y empresas para detectar concentracion operativa."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <DataTable
          title="Ranking de rutas"
          subtitle="Top corredores por cantidad de viajes y toneladas reportadas."
          columns={[
            { key: 'route', label: 'Ruta' },
            { key: 'trips', label: 'Viajes' },
            { key: 'incidents', label: 'Toneladas' },
          ]}
          rows={routeRanking}
          rowKey="route"
        />
        <DataTable
          title="Ranking de empresas"
          subtitle="Empresas con mayor participacion segun manifiestos y toneladas."
          columns={[
            { key: 'company', label: 'Empresa' },
            { key: 'manifests', label: 'Manifiestos' },
            { key: 'compliance', label: 'Toneladas' },
          ]}
          rows={companyRanking}
          rowKey="company"
        />
      </div>
      <InsightsPanel title="Hallazgos del periodo" items={insightItems} />
    </section>
  );
}
