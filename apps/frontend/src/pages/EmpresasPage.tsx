import { KpiCard } from '../components/common/KpiCard';
import { DataTable } from '../components/common/DataTable';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { CompanyDetailCard } from '../components/companies/CompanyDetailCard';
import { useEmpresasPage } from '../hooks/useEmpresasPage';

export function EmpresasPage(): JSX.Element {
  const { loading, error, kpis, companies, selectedCompany, setSelectedCompany, reload } = useEmpresasPage();

  if (loading) {
    return <LoadingState title="Cargando empresas" />;
  }

  if (error) {
    return <ErrorState title="Error en empresas" message={error} onRetry={reload} />;
  }

  if (!companies.length) {
    return <EmptyState title="Sin empresas habilitadas" message="No hay empresas registradas." />;
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <DataTable
          title="Empresas habilitadas"
          columns={[
            { key: 'name', label: 'Empresa' },
            { key: 'nit', label: 'NIT' },
            { key: 'activeVehicles', label: 'Vehiculos Activos' },
            { key: 'compliance', label: 'Cumplimiento' },
          ]}
          rows={companies}
          rowKey="id"
          onRowClick={(row) => setSelectedCompany(String(row.id))}
        />
        <CompanyDetailCard company={selectedCompany} />
      </div>
    </section>
  );
}
