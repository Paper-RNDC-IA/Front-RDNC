type LoadingStateProps = {
  title?: string;
};

export function LoadingState({ title = 'Cargando informacion' }: LoadingStateProps): JSX.Element {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60">
      <div className="text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-orange-300" />
        <p className="text-sm text-slate-300">{title}</p>
      </div>
    </div>
  );
}
