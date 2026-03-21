import { useState } from 'react';

import { Card } from '../common/Card';

type CompanyFileUploaderProps = {
  uploading: boolean;
  onUpload: (file: File) => Promise<void>;
};

export function CompanyFileUploader({ uploading, onUpload }: CompanyFileUploaderProps): JSX.Element {
  const [fileName, setFileName] = useState('');

  const handleFileSelection = async (file: File | null): Promise<void> => {
    if (!file) {
      return;
    }

    setFileName(file.name);
    await onUpload(file);
  };

  return (
    <Card title="Carga y gestion de archivos internos">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          type="file"
          accept=".xlsx,.xls,.csv,.json"
          onChange={(event) => void handleFileSelection(event.target.files?.[0] ?? null)}
          className="block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
        />

        <div className="text-xs text-slate-400">{fileName ? `Archivo: ${fileName}` : 'Sin archivo seleccionado'}</div>

        {uploading ? <span className="text-xs text-orange-300">Subiendo...</span> : null}
      </div>
    </Card>
  );
}
