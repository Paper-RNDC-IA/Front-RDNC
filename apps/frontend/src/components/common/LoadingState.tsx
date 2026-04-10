type LoadingStateProps = {
  title?: string;
  detail?: string;
};

export function LoadingState({
  title = 'Cargando informacion',
  detail = 'Cargando datos del backend... esto puede tardar unos segundos por cold start.',
}: LoadingStateProps): JSX.Element {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60">
      <div className="text-center">
        <div className="mx-auto mb-3 h-11 w-11 animate-spin rounded-full border-2 border-slate-600 border-t-orange-300" />
        <p className="text-sm font-semibold text-slate-200">{title}</p>
        <p className="mt-1 text-xs text-slate-400">{detail}</p>
      </div>
    </div>
  );
}
