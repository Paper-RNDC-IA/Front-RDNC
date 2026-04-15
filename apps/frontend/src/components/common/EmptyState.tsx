type EmptyStateProps = {
  title: string;
  message: string;
  explanation?: string;
  source?: string;
};

export function EmptyState({
  title,
  message,
  explanation = 'No hay suficiente informacion para construir una lectura confiable en este momento.',
  source,
}: EmptyStateProps): JSX.Element {
  return (
    <div className="rounded-2xl border-2 border-zinc-200 bg-white p-7 text-center shadow-[0_12px_26px_rgba(15,23,42,0.08)]">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
      <p className="mt-2 text-xs text-slate-500">{explanation}</p>
      {source ? <p className="mt-1 text-xs text-slate-500">Fuente esperada: {source}</p> : null}
      <p className="mt-2 text-xs text-slate-500">
        Ajusta filtros de fecha o espera una nueva sincronizacion de datos.
      </p>
    </div>
  );
}
