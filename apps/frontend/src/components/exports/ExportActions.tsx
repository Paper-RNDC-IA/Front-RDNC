import type { DateRange } from '../../types/common';
import { Card } from '../common/Card';

type ExportActionsProps = {
  module: string;
  dateRange: DateRange;
  onExportCsv: () => Promise<void>;
  onExportExcel: () => Promise<void>;
  onExportPdf: () => Promise<void>;
};

export function ExportActions({
  module,
  dateRange,
  onExportCsv,
  onExportExcel,
  onExportPdf,
}: ExportActionsProps): JSX.Element {
  return (
    <Card title="Exportar informe">
      <p className="mb-4 text-sm text-slate-400">
        Modulo: <span className="text-slate-200">{module}</span> | Rango: {dateRange.from} - {dateRange.to}
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void onExportCsv()}
          className="rounded-md bg-orange-900/45 px-3 py-2 text-sm text-orange-100 hover:bg-orange-800/55"
        >
          Exportar CSV
        </button>
        <button
          type="button"
          onClick={() => void onExportExcel()}
          className="rounded-md bg-orange-700 px-3 py-2 text-sm text-white hover:bg-orange-600"
        >
          Exportar Excel
        </button>
        <button
          type="button"
          onClick={() => void onExportPdf()}
          className="rounded-md bg-amber-700 px-3 py-2 text-sm text-white hover:bg-amber-600"
        >
          Exportar PDF
        </button>
      </div>
    </Card>
  );
}
