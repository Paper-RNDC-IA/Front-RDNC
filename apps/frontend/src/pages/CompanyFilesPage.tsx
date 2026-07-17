import { useNavigate } from 'react-router-dom';

import { CompanyFilesTable } from '../components/companies/CompanyFilesTable';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { KpiCard } from '../components/common/KpiCard';
import { LoadingState } from '../components/common/LoadingState';
import { useCompanyWorkspacePage } from '../hooks/useCompanyWorkspacePage';

export function CompanyFilesPage(): JSX.Element {
  const navigate = useNavigate();

  const {
    loading,
    error,
    session,
    fileRows,
    summaryKpis,
    selectedFileId,
    deletingFileId,
    onDeleteFile,
    reload,
  } = useCompanyWorkspacePage();

  if (loading) {
    return <LoadingState title="Cargando archivos" />;
  }

  if (error && !session) {
    return <ErrorState title="Error de sesión" message={error} onRetry={reload} />;
  }

  if (!session) {
    return (
      <EmptyState
        title="Sin sesión empresarial"
        message="Inicia sesión para acceder al historial de archivos."
      />
    );
  }

  const handleViewFile = async (fileId: string): Promise<void> => {
    navigate(`/app/portal-empresa?file=${fileId}`);
  };

  return (
    <section className="space-y-6">

      {/* Header empresa */}
      <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">Portal Privado · Archivos</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{session.companyName}</h2>
            <p className="mt-0.5 text-sm text-slate-500">NIT: {session.companyNit}</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-2 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            <span className="text-xs font-medium text-slate-600">Sesión activa</span>
          </div>
        </div>
      </div>

      {error ? (
        <ErrorState title="Novedad en archivos" message={error} onRetry={reload} />
      ) : null}

      {/* Resumen de archivos */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryKpis.map((item) => (
          <KpiCard key={item.label} item={item} sourceLabel="Portal empresarial" />
        ))}
      </div>

      {/* Tabla de archivos */}
      {fileRows.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center">
          <p className="text-4xl">📂</p>
          <p className="mt-3 text-base font-semibold text-slate-700">Sin archivos cargados</p>
          <p className="mt-1 text-sm text-slate-400">
            Ve a <span className="font-medium text-orange-600">Mis datos</span> para subir tu primer archivo Excel.
          </p>
        </div>
      ) : (
        <CompanyFilesTable
          rows={fileRows}
          selectedFileId={selectedFileId}
          deletingFileId={deletingFileId}
          onSelectFile={handleViewFile}
          onDeleteFile={onDeleteFile}
        />
      )}
    </section>
  );
}
