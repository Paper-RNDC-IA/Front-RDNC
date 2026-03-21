import { useMemo } from 'react';

import type { MapDepartment } from './types';
import { exportRowsToExcel, exportSectionToPdf } from '../../utils/exports';
import { formatNumber } from '../../utils/formatters';

type DetailedReportModalProps = {
  open: boolean;
  department: MapDepartment | null;
  onClose: () => void;
};

function formatMetric(value: number | null, unit: string): string {
  if (value === null) {
    return 'Sin dato';
  }

  return `${formatNumber(value)} ${unit}`.trim();
}

export function DetailedReportModal({ open, department, onClose }: DetailedReportModalProps): JSX.Element | null {
  const reportRows = useMemo(() => {
    if (!department) {
      return [];
    }

    return [
      {
        capa: 'Produccion',
        valor: formatMetric(department.values.production.value, department.values.production.unit),
        disponible: department.values.production.available ? 'Si' : 'No',
      },
      {
        capa: 'Demanda',
        valor: formatMetric(department.values.demand.value, department.values.demand.unit),
        disponible: department.values.demand.available ? 'Si' : 'No',
      },
      {
        capa: 'Regalias',
        valor: formatMetric(department.values.royalties.value, department.values.royalties.unit),
        disponible: department.values.royalties.available ? 'Si' : 'No',
      },
    ];
  }, [department]);

  if (!open || !department) {
    return null;
  }

  const contentId = `department-report-${department.id}`;

  const handleExportPdf = async (): Promise<void> => {
    await exportSectionToPdf(contentId, `reporte-detallado-${department.id}.pdf`);
  };

  const handleExportExcel = (): void => {
    exportRowsToExcel(reportRows, `reporte-detallado-${department.id}.xlsx`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4" onClick={onClose}>
      <article
        id={contentId}
        className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-slate-100">Informe detallado</h3>
            <p className="mt-1 text-sm text-slate-400">Departamento: {department.name}</p>
          </div>
          <button
            type="button"
            className="rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-200"
            onClick={onClose}
          >
            Cerrar
          </button>
        </header>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-950">
              <tr className="text-slate-400">
                <th className="px-3 py-2">Capa</th>
                <th className="px-3 py-2">Valor</th>
                <th className="px-3 py-2">Disponible</th>
              </tr>
            </thead>
            <tbody>
              {reportRows.map((row) => (
                <tr key={row.capa} className="border-t border-slate-800 text-slate-200">
                  <td className="px-3 py-2">{row.capa}</td>
                  <td className="px-3 py-2">{row.valor}</td>
                  <td className="px-3 py-2">{row.disponible}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-md bg-orange-700 px-3 py-2 text-sm text-white hover:bg-orange-600"
            onClick={() => void handleExportPdf()}
          >
            Exportar PDF
          </button>
          <button
            type="button"
            className="rounded-md bg-amber-700 px-3 py-2 text-sm text-white hover:bg-amber-600"
            onClick={handleExportExcel}
          >
            Exportar Excel
          </button>
        </div>
      </article>
    </div>
  );
}
