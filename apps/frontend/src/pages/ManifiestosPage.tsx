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

  const isInitialLoading = loading && !kpis.length && !trends.length;

  if (isInitialLoading) {
    return <LoadingState title="Cargando modulo de manifiestos" />;
  }
  const hasData = kpis.length > 0;

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
      <DataSourceBadge
        module="Analisis de manifiestos RNDC"
        sourceLabel="RNDC publico"
        sourceDetail="Datos de manifiestos reportados oficialmente y procesados por ETL"
        visibility="public"
      />
      <PageIntro
        title="Analisis Publico de Manifiestos"
        subtitle="Explica volumen, corredores y participacion empresarial con base en manifiestos del RNDC para lectura operativa y academica."
        periodLabel={periodLabel}
        highlights={[
          'Que muestra: dinamica de carga reportada',
          'Para que sirve: detectar concentraciones',
          'Fuente: RNDC publico',
          'Analisis: rutas, empresas y tendencia',
        ]}
        moduleGuide={{
          summary:
            'Este modulo analiza los manifiestos del RNDC para mostrar como se distribuye la actividad por rutas, empresas y categorias.',
          purpose:
            'Permite identificar corredores principales, empresas con mayor volumen y patrones del periodo filtrado.',
          userType: 'Evaluadores, analistas logísticos y actores de planeacion sectorial.',
          source: 'RNDC publico, transformado por servicios de manifiestos en backend.',
          analysisType: 'Analisis descriptivo comparativo por ranking, tendencia y composicion.',
          scope: 'Periodo seleccionado por el usuario con cobertura nacional reportada.',
          interpretation:
            'Cruce la tendencia con rankings para entender si el crecimiento proviene de pocas rutas o de expansion general.',
          limitations:
            'Los datos dependen del reporte oficial y pueden tener rezago en actualizacion.',
          useCases: [
            'Explicar concentracion de carga por corredor.',
            'Comparar empresas con mayor participacion.',
            'Sustentar hallazgos con tablas y graficos complementarios.',
          ],
        }}
      />
      <DateRangeFilter value={dateRange} onChange={setDateRange} />
      {error ? <ErrorState title="Error en manifiestos" message={error} onRetry={reload} /> : null}
      {!error && !hasData ? (
        <EmptyState
          title="Sin manifiestos"
          message="No hay datos para el rango seleccionado."
          source="RNDC publico /api/manifests/*"
        />
      ) : null}
      {!error && hasData ? (
        <>
          <SectionHeader
            title="KPIs del modulo"
            description="Indicadores clave para seguimiento del volumen y comportamiento de manifiestos."
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            {kpis.map((item) => (
              <KpiCard key={item.label} item={item} sourceLabel="RNDC publico" />
            ))}
          </div>
          <SectionHeader
            title="Tendencia y composicion"
            description="Este bloque muestra como cambia el volumen y en que categorias se concentra."
          />
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
            <LineChartWidget
              title="Tendencia de manifiestos"
              subtitle="Como evoluciona el total de manifiestos por periodo"
              data={trends}
              dataKey="value"
              xKey="label"
              metricLabel="Manifiestos"
              sourceLabel="RNDC publico"
              help={{
                description: 'Serie temporal del volumen de manifiestos en el rango seleccionado.',
                xAxis: 'Periodos dentro del rango de fechas.',
                yAxis: 'Cantidad de manifiestos reportados.',
                interpretation:
                  'Subidas sostenidas sugieren mayor actividad logistica; caidas pueden indicar contraccion o estacionalidad.',
              }}
            />
            <PieChartWidget
              title="Distribucion por categoria"
              subtitle="Que tipo de registros concentra mayor volumen"
              data={distribution}
              dataKey="value"
              nameKey="label"
              sourceLabel="RNDC publico"
              help={{
                description:
                  'Distribucion de categorias para entender en que se concentra el volumen.',
                xAxis: 'Categoria o tipo de registro.',
                yAxis: 'Participacion porcentual del total.',
                interpretation:
                  'Categorias dominantes explican la mayor parte del comportamiento operativo del periodo.',
              }}
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
            sourceLabel="RNDC publico"
            help={{
              description: 'Ranking de corredores con mayor frecuencia de viajes.',
              xAxis: 'Numero de viajes.',
              yAxis: 'Ruta o corredor.',
              interpretation:
                'Las primeras rutas representan los ejes con mayor presion operativa y relevancia logistica.',
            }}
          />
          <SectionHeader
            title="Rankings"
            description="Compara corredores y empresas para detectar concentracion operativa."
          />
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
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
              sourceLabel="RNDC publico"
              helpText="Lista corredores con viajes y toneladas para comparar intensidad y volumen de carga."
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
              sourceLabel="RNDC publico"
              helpText="Muestra empresas lideres del periodo para evaluar participacion y concentracion del mercado."
            />
          </div>
          <InsightsPanel title="Hallazgos del periodo" items={insightItems} />
        </>
      ) : null}
    </section>
  );
}
