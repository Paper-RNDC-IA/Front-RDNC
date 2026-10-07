type ErrorStateProps = {
  title: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ title, message, onRetry }: ErrorStateProps): JSX.Element {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-[#ffffff] p-6 shadow-card">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-700">{message}</p>
      <p className="mt-1 text-xs text-slate-500">
        Verifica conectividad con el backend y vuelve a intentar.
      </p>
      {onRetry ? (
        <button
          type="button"
          className="mt-4 rounded-md border border-orange-300 bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
          onClick={onRetry}
        >
          Reintentar
        </button>
      ) : null}
    </div>
  );
}
