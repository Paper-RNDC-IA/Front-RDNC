type LoadingStateProps = {
  title?: string;
  detail?: string;
};

export function LoadingState({
  title = 'Cargando informacion',
  detail = 'Cargando datos del backend... esto puede tardar unos segundos por cold start.',
}: LoadingStateProps): JSX.Element {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-2xl border-2 border-zinc-200 bg-white shadow-[0_12px_26px_rgba(15,23,42,0.08)]">
      <div className="text-center">
        <div className="mx-auto mb-3 h-11 w-11 animate-spin rounded-full border-2 border-zinc-300 border-t-orange-500" />
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{detail}</p>
      </div>
    </div>
  );
}
