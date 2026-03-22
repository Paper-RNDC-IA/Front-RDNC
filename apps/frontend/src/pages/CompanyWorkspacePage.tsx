import { CompanyFileUploader } from '../components/companies/CompanyFileUploader';
import { CompanyFilesTable } from '../components/companies/CompanyFilesTable';
import { FileInsightPanel } from '../components/companies/FileInsightPanel';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { KpiCard } from '../components/common/KpiCard';
import { LoadingState } from '../components/common/LoadingState';
import { SectionLegend } from '../components/common/SectionLegend';
import { useCompanyWorkspacePage } from '../hooks/useCompanyWorkspacePage';

export function CompanyWorkspacePage(): JSX.Element {
  const {
    loading,
    insightLoading,
    uploading,
    deletingFileId,
    error,
    session,
    fileRows,
    summaryKpis,
    selectedFileId,
    selectedFileName,
    insightKpis,
    insightTrend,
    insightCategories,
    insightNotes,
    onUploadFile,
    onDeleteFile,
    onSelectFile,
    onExportCsv,
    onExportExcel,
    onExportPdf,
    reload,
  } = useCompanyWorkspacePage();

  if (loading) {
    return <LoadingState title="Cargando portal empresarial" />;
  }

  if (error && !session) {
    return <ErrorState title="Error de sesion empresarial" message={error} onRetry={reload} />;
  }

  if (!session) {
    return <EmptyState title="Sin sesion empresarial" message="Inicia sesion para acceder al entorno privado." />;
  }

  return (
    <section className="space-y-6" id="company-workspace-report">
      {error ? <ErrorState title="Novedad en portal empresarial" message={error} onRetry={reload} /> : null}

      <SectionLegend
        title="Leyenda de Portal Empresa"
        items={[
          { label: 'Entorno privado', description: 'Sesion autenticada con datos propios de la empresa.' },
          { label: 'Carga de archivos', description: 'Ingreso de insumos para analisis interno y reportes.' },
          { label: 'Tabla de archivos', description: 'Gestion de seleccion, consulta y eliminacion de archivos.' },
          { label: 'Panel de insights', description: 'Indicadores, tendencias y exportables derivados del archivo.' },
        ]}
      />

      <Card title="Entorno privado y seguro de empresa">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs text-slate-400">Empresa</p>
            <p className="text-sm font-semibold text-slate-100">{session.companyName}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs text-slate-400">Correo</p>
            <p className="text-sm font-semibold text-slate-100">{session.email}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs text-slate-400">NIT</p>
            <p className="text-sm font-semibold text-slate-100">{session.companyNit}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </div>

      <CompanyFileUploader uploading={uploading} onUpload={onUploadFile} />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <CompanyFilesTable
          rows={fileRows}
          selectedFileId={selectedFileId}
          deletingFileId={deletingFileId}
          onSelectFile={onSelectFile}
          onDeleteFile={onDeleteFile}
        />

        <FileInsightPanel
          fileName={selectedFileName}
          loading={insightLoading}
          kpis={insightKpis}
          trendData={insightTrend}
          categoriesData={insightCategories}
          notes={insightNotes}
          onExportCsv={onExportCsv}
          onExportExcel={onExportExcel}
          onExportPdf={onExportPdf}
        />
      </div>
    </section>
  );
}
