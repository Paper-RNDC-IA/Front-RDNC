import { getApiSyncInfo } from '../../services/http';

type DataSourceBadgeProps = {
  module: string;
  endpoints?: string[];
  updatedAt?: string;
};

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return 'Sin registros aun';
  }

  try {
    return new Date(value).toLocaleString('es-CO');
  } catch {
    return value;
  }
}

export function DataSourceBadge({ module, updatedAt }: DataSourceBadgeProps): JSX.Element {
  const syncInfo = getApiSyncInfo();
  const lastLoad = updatedAt ?? syncInfo.lastClientAt;

  return (
    <div className="rounded-xl border border-emerald-900/70 bg-emerald-950/20 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-300">
            Datos verificados
          </p>
          <p className="text-sm font-semibold text-slate-100">{module}</p>
        </div>
      </div>

      <div className="mt-2 rounded-lg border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-xs text-slate-300">
        <p className="text-[11px] uppercase tracking-wide text-slate-400">Ultima carga</p>
        <p className="mt-1 font-medium text-slate-100">{formatDate(lastLoad)}</p>
      </div>
    </div>
  );
}
