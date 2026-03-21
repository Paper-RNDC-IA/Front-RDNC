import type { CompanyFileRow } from '../../adapters/company-portal.adapter';
import { Card } from '../common/Card';

type CompanyFilesTableProps = {
  rows: CompanyFileRow[];
  selectedFileId: string | null;
  deletingFileId: string | null;
  onSelectFile: (fileId: string) => Promise<void>;
  onDeleteFile: (fileId: string) => Promise<void>;
};

export function CompanyFilesTable({
  rows,
  selectedFileId,
  deletingFileId,
  onSelectFile,
  onDeleteFile,
}: CompanyFilesTableProps): JSX.Element {
  return (
    <Card title="Archivos internos cargados">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="px-3 py-2 font-medium">Archivo</th>
              <th className="px-3 py-2 font-medium">Modulo</th>
              <th className="px-3 py-2 font-medium">Registros</th>
              <th className="px-3 py-2 font-medium">Estado</th>
              <th className="px-3 py-2 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isSelected = row.id === selectedFileId;
              const isDeleting = row.id === deletingFileId;

              return (
                <tr
                  key={row.id}
                  className={[
                    'border-b border-slate-900 transition-colors',
                    isSelected
                      ? 'bg-orange-600/10 text-orange-100'
                      : 'text-slate-200 hover:bg-slate-800/40',
                  ].join(' ')}
                >
                  <td className="px-3 py-2">
                    <div className="font-medium">{row.fileName}</div>
                    <div className="text-xs text-slate-400">{row.uploadedAt}</div>
                  </td>
                  <td className="px-3 py-2">{row.module}</td>
                  <td className="px-3 py-2">{row.records}</td>
                  <td className="px-3 py-2">{row.status}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800"
                        onClick={() => void onSelectFile(row.id)}
                      >
                        Ver
                      </button>
                      <button
                        type="button"
                        disabled={isDeleting}
                        className="rounded-md border border-rose-700/60 px-2 py-1 text-xs text-rose-200 hover:bg-rose-950/40 disabled:cursor-not-allowed"
                        onClick={() => void onDeleteFile(row.id)}
                      >
                        {isDeleting ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
