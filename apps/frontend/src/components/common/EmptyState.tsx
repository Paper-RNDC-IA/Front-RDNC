type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps): JSX.Element {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{message}</p>
      <p className="mt-2 text-xs text-slate-500">
        Ajusta filtros de fecha o espera una nueva sincronizacion de datos.
      </p>
    </div>
  );
}
