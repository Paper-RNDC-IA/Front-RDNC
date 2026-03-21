import { useState } from 'react';

import { Card } from '../common/Card';

type ExcelUploaderProps = {
  onUpload: (file: File) => Promise<void>;
};

export function ExcelUploader({ onUpload }: ExcelUploaderProps): JSX.Element {
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | null) => {
    if (!file) {
      return;
    }

    setFileName(file.name);
    setUploading(true);

    try {
      await onUpload(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card title="Carga de archivo GPS (Excel)">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(event) => void handleFile(event.target.files?.[0] ?? null)}
          className="block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
        />
        <span className="text-xs text-slate-400">{fileName || 'Sin archivo cargado'}</span>
        {uploading ? <span className="text-xs text-orange-300">Procesando...</span> : null}
      </div>
    </Card>
  );
}
