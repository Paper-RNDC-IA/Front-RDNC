import { Link, useSearchParams } from 'react-router-dom';

import { CompanyFileUploader } from '../components/companies/CompanyFileUploader';
import { FileInsightPanel } from '../components/companies/FileInsightPanel';
import { RouteMapPanel } from '../components/portal/RouteMapPanel';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { useCompanyWorkspacePage } from '../hooks/useCompanyWorkspacePage';

function FileKindBadge({ kind }: { kind: string | null }): JSX.Element | null {
  if (!kind) return null;
  const config: Record<string, { label: string; className: string }> = {
    rndc_stats: { label: 'RNDC Stats', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    gps: { label: 'GPS Procesado', className: 'bg-green-100 text-green-700 border-green-200' },
    gps_raw: { label: 'GPS (sin ruta)', className: 'bg-amber-100 text-amber-700 border-amber-200' },
    unknown: { label: 'Formato desconocido', className: 'bg-red-100 text-red-700 border-red-200' },
    error: { label: 'Error de lectura', className: 'bg-red-100 text-red-700 border-red-200' },
    missing: { label: 'Archivo faltante', className: 'bg-red-100 text-red-700 border-red-200' },
  };
  const c = config[kind];
  if (!c) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${c.className}`}
    >
      {c.label}
    </span>
  );
}

export function CompanyWorkspacePage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const initialFileId = searchParams.get('file');

  const {
    loading,
    insightLoading,
    uploading,
    error,
    session,
    fileRows,
    fileKind,
    selectedFileId,
    selectedFileName,
    insightKpis,
    insightTrend,
    insightCategories,
    insightNotes,
    onUploadFile,
    onExportCsv,
    onExportExcel,
    onExportPdf,
    reload,
  } = useCompanyWorkspacePage(initialFileId);

  if (loading) {
    return <LoadingState title="Cargando portal empresarial" />;
  }

  if (error && !session) {
    return <ErrorState title="Error de sesión empresarial" message={error} onRetry={reload} />;
  }

  if (!session) {
    return (
      <EmptyState
        title="Sin sesión empresarial"
        message="Inicia sesión para acceder al entorno privado."
      />
    );
  }

  const hasFiles = fileRows.length > 0;
  const isGps = fileKind === 'gps' || fileKind === 'gps_raw';
  const isRndc = fileKind === 'rndc_stats';
  const isBadFormat = fileKind === 'unknown' || fileKind === 'error' || fileKind === 'missing';

  return (
    <section className="space-y-6" id="company-workspace-report">
      {/* Header empresa */}
      <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">
              Portal Privado
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{session.companyName}</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              NIT: {session.companyNit} · {session.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {hasFiles ? (
              <Link
                to="/app/mis-archivos"
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline-offset-2 hover:underline"
              >
                {fileRows.length} archivo{fileRows.length !== 1 ? 's' : ''} →
              </Link>
            ) : null}
            <div className="flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-2 shadow-sm">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-xs font-medium text-slate-600">Sesión activa</span>
            </div>
          </div>
        </div>
      </div>

      {error ? <ErrorState title="Novedad en portal" message={error} onRetry={reload} /> : null}

      {/* Zona de carga */}
      <div className="rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/40 px-6 py-5">
        <div className="mb-3 flex items-center gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {hasFiles ? 'Cargar nuevo archivo' : '¡Empieza aquí! Carga tu archivo Excel'}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Acepta archivos RNDC de estadísticas (.xlsx) o telemetría GPS (.xls / .xlsx).
            </p>
          </div>
        </div>
        <CompanyFileUploader uploading={uploading} onUpload={onUploadFile} />
      </div>

      {/* Sin archivos todavía */}
      {!hasFiles ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center">
          <p className="text-4xl">📂</p>
          <p className="mt-3 text-base font-semibold text-slate-700">
            Aún no tienes archivos cargados
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Sube tu primer archivo Excel para ver el análisis y el mapa aquí.
          </p>
        </div>
      ) : null}

      {/* ── CONTENIDO ADAPTIVO según el tipo de archivo ── */}

      {/* Archivo RNDC de estadísticas: análisis primero */}
      {hasFiles && isRndc ? (
        <>
          <div>
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-800">
                {selectedFileName ? `Análisis: ${selectedFileName}` : 'Análisis estadístico'}
              </h3>
              <FileKindBadge kind={fileKind} />
            </div>
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

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-700">
              📍 Mapa GPS no disponible para este archivo
            </p>
            <p className="mt-1">
              Este es un archivo de estadísticas RNDC, no contiene coordenadas GPS. Para ver
              recorridos en el mapa, sube un archivo de telemetría vehicular con columnas:{' '}
              <span className="font-mono text-xs">fecha, hora, latitud, longitud, velocidad</span>.
            </p>
          </div>
        </>
      ) : null}

      {/* Archivo GPS: mapa primero, luego KPIs */}
      {hasFiles && isGps ? (
        <>
          <div>
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-800">Mapa de recorrido GPS</h3>
              <FileKindBadge kind={fileKind} />
            </div>
            <p className="mb-4 text-sm text-slate-500">
              El vehículo y mes se seleccionan automáticamente. Puedes cambiarlos en los filtros.
            </p>
            <RouteMapPanel companyId={session.companyId} selectedFileId={selectedFileId} />
          </div>

          {insightKpis.length > 0 ? (
            <div>
              <h3 className="mb-3 text-base font-semibold text-slate-800">
                Resumen del archivo GPS
              </h3>
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
          ) : null}
        </>
      ) : null}

      {/* Formato desconocido o error */}
      {hasFiles && isBadFormat ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-base font-semibold text-red-800">Archivo no compatible</p>
            <FileKindBadge kind={fileKind} />
          </div>
          {insightNotes.length > 0 ? (
            <ul className="space-y-1">
              {insightNotes.map((n) => (
                <li key={n.label} className="text-sm text-red-700">
                  {n.value}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-4 rounded-lg border border-red-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold mb-2">Formatos aceptados:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>
                <strong>Estadísticas RNDC:</strong> columnas VIAJES, PLACAS, KILOGRAMOS, ANOMES…
              </li>
              <li>
                <strong>Telemetría GPS:</strong> columnas fecha, hora, latitud, longitud, velocidad…
              </li>
            </ul>
          </div>
        </div>
      ) : null}

      {/* Aún cargando insight (sin file_kind todavía) */}
      {hasFiles && !fileKind && !insightLoading && !isBadFormat && !isGps && !isRndc ? (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-800">
              {selectedFileName ? `Análisis: ${selectedFileName}` : 'Análisis del archivo'}
            </h3>
          </div>
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
          <div className="mt-6">
            <h3 className="mb-3 text-base font-semibold text-slate-800">Mapa de recorrido GPS</h3>
            <RouteMapPanel companyId={session.companyId} selectedFileId={selectedFileId} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
