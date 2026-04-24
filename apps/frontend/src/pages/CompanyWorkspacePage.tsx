import { CompanyFileUploader } from '../components/companies/CompanyFileUploader';
import { CompanyFilesTable } from '../components/companies/CompanyFilesTable';
import { FileInsightPanel } from '../components/companies/FileInsightPanel';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { KpiCard } from '../components/common/KpiCard';
import { LoadingState } from '../components/common/LoadingState';
import { DataSourceBadge } from '../components/common/DataSourceBadge';
import { PageIntro } from '../components/common/PageIntro';
import { RouteMapPanel } from '../components/portal/RouteMapPanel';
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
    return (
      <EmptyState
        title="Sin sesion empresarial"
        message="Inicia sesion para acceder al entorno privado."
      />
    );
  }

  return (
    <section className="space-y-6" id="company-workspace-report">
      {error ? (
        <ErrorState title="Novedad en portal empresarial" message={error} onRetry={reload} />
      ) : null}

      <DataSourceBadge
        module="Portal privado empresarial"
        sourceLabel="Telemetria empresarial"
        sourceDetail="Datos internos cargados por la empresa autenticada"
        visibility="private"
      />

      <PageIntro
        title="Zona Privada Empresarial"
        subtitle="Espacio seguro para cargar archivos propios, revisar historico y generar analitica interna de telemetria."
        highlights={[
          'Que muestra: datos internos de empresa',
          'Para que sirve: control operacional privado',
          'Fuente: Excel empresarial cargado por usuario',
          'Acciones: cargar, analizar y exportar',
        ]}
        moduleGuide={{
          summary:
            'Este modulo centraliza el ciclo privado de archivos empresariales: carga, trazabilidad, analisis y exportacion.',
          purpose:
            'Facilita que cada empresa convierta sus datos crudos en indicadores accionables sin exponer informacion sensible.',
          userType: 'Usuarios autenticados de cada empresa.',
          source: 'Archivos Excel privados cargados en la sesion empresarial.',
          analysisType: 'Analisis interno de KPIs, tendencia y categorias por archivo.',
          scope: 'Restringido a la empresa autenticada y su historico de archivos.',
          interpretation:
            'Seleccione un archivo para activar las visualizaciones; compare KPIs y tendencia para evaluar calidad operativa.',
          limitations:
            'Los resultados dependen de la calidad del archivo y de la estructura esperada por el sistema.',
          useCases: [
            'Auditar calidad de cargas internas.',
            'Construir reportes operativos privados.',
            'Preparar evidencia para reuniones de seguimiento.',
          ],
        }}
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
          <KpiCard key={item.label} item={item} sourceLabel="Telemetria empresarial" />
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

      <RouteMapPanel companyId={session.companyId} selectedFileId={selectedFileId} />
    </section>
  );
}
