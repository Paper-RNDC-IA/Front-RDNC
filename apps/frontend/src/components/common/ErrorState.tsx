type ErrorStateProps = {
  title: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ title, message, onRetry }: ErrorStateProps): JSX.Element {
  return (
    <div className="rounded-2xl border border-rose-900/60 bg-rose-950/30 p-6">
      <h3 className="text-lg font-semibold text-rose-200">{title}</h3>
      <p className="mt-2 text-sm text-rose-100/90">{message}</p>
      {onRetry ? (
        <button
          type="button"
          className="mt-4 rounded-md bg-rose-400/20 px-3 py-2 text-sm text-rose-100"
          onClick={onRetry}
        >
          Reintentar
        </button>
      ) : null}
    </div>
  );
}
