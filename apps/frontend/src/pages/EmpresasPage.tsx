import { KpiCard } from '../components/common/KpiCard';
import { DataTable } from '../components/common/DataTable';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { DateRangeFilter } from '../components/common/DateRangeFilter';
import { DataSourceBadge } from '../components/common/DataSourceBadge';
import { PageIntro } from '../components/common/PageIntro';
import { SectionHeader } from '../components/common/SectionHeader';
import { InsightsPanel } from '../components/common/InsightsPanel';
import { BarChartWidget } from '../components/charts/BarChartWidget';
import { PieChartWidget } from '../components/charts/PieChartWidget';
import { CompanyDetailCard } from '../components/companies/CompanyDetailCard';
import { useEmpresasPage } from '../hooks/useEmpresasPage';

function parseVehicles(value: string | number): number {
  if (typeof value === 'number') {
    return value;
  }

  return Number(String(value).replace(/\./g, '').replace(',', '.')) || 0;
}

export function EmpresasPage(): JSX.Element {
  const {
    loading,
    error,
    dateRange,
    kpis,
    companies,
    selectedCompany,
    setDateRange,
    setSelectedCompany,
    reload,
  } = useEmpresasPage();

  if (loading) {
    return <LoadingState title="Cargando empresas" />;
  }

  if (error) {
    return <ErrorState title="Error en empresas" message={error} onRetry={reload} />;
  }

  if (!companies.length) {
    return <EmptyState title="Sin empresas habilitadas" message="No hay empresas registradas." />;
  }

  const periodLabel = `${dateRange.from} a ${dateRange.to}`;
  const topCompany = [...companies].sort(
    (a, b) => parseVehicles(b.activeVehicles) - parseVehicles(a.activeVehicles),
  )[0];

  const companyBarData = [...companies]
    .map((item) => ({
      label: item.name,
      value: parseVehicles(item.activeVehicles),
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const statusMap = companies.reduce<Map<string, number>>((acc, company) => {
    const key = company.status || 'Sin estado';
    acc.set(key, (acc.get(key) ?? 0) + 1);
    return acc;
  }, new Map<string, number>());

  const companyPieData = Array.from(statusMap.entries()).map(([label, value]) => ({
    label,
    value,
  }));

  const insightItems = [
    topCompany
      ? {
          title: 'Empresa con mayor capacidad activa',
          detail: `${topCompany.name} lidera con ${topCompany.activeVehicles} vehiculos activos en el periodo.`,
          tone: 'positive' as const,
        }
      : null,
    selectedCompany
      ? {
          title: 'Empresa seleccionada para analisis',
          detail: `${selectedCompany.name} reporta cumplimiento de ${selectedCompany.compliance} y estado ${selectedCompany.status}.`,
          tone: 'neutral' as const,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <section className="space-y-6 md:space-y-8">
      <DataSourceBadge module="Empresas" />
      <PageIntro
        title="Panel de Empresas"
        subtitle="Compara empresas habilitadas por actividad y cumplimiento para identificar actores principales del ecosistema logistica."
        periodLabel={periodLabel}
        highlights={[
          'Ranking por actividad',
          'Comparativo por cumplimiento',
          'Detalle por empresa',
        ]}
      />
      <DateRangeFilter value={dateRange} onChange={setDateRange} />
      <SectionHeader
        title="KPIs empresariales"
        description="Indicadores agregados para medir capacidad y comportamiento del tejido empresarial."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </div>
      <SectionHeader
        title="Comparativo y detalle"
        description="Selecciona una empresa en la tabla para revisar su ficha de comportamiento."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <BarChartWidget
          title="Top empresas por vehiculos"
          subtitle="Ranking de capacidad activa para priorizar seguimiento"
          data={companyBarData}
          dataKey="value"
          xKey="label"
          horizontal
          sortDescending
          valueLabel="Vehiculos"
        />
        <PieChartWidget
          title="Distribucion por estado"
          subtitle="Participacion de empresas por estado operativo"
          data={companyPieData}
          dataKey="value"
          nameKey="label"
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <DataTable
          title="Empresas habilitadas"
          subtitle="Ranking operativo de empresas registradas con posibilidad de drill-down en detalle."
          columns={[
            { key: 'name', label: 'Empresa' },
            { key: 'nit', label: 'NIT' },
            { key: 'activeVehicles', label: 'Vehiculos Activos' },
            { key: 'compliance', label: 'Cumplimiento' },
          ]}
          rows={companies}
          rowKey="id"
          onRowClick={(row) => setSelectedCompany(String(row.id))}
          maxRows={12}
        />
        <CompanyDetailCard company={selectedCompany} />
      </div>
      <InsightsPanel title="Hallazgos empresariales" items={insightItems} />
    </section>
  );
}
