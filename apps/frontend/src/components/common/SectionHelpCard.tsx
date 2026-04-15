type SectionHelpCardProps = {
  title?: string;
  summary: string;
  purpose: string;
  analysisType: string;
  className?: string;
};

export function SectionHelpCard({
  title = 'Que muestra este modulo?',
  summary,
  purpose,
  analysisType,
  className,
}: SectionHelpCardProps): JSX.Element {
  const rows = [
    { label: 'Descripcion y para que sirve', value: `${summary} ${purpose}` },
    { label: 'Tipo de analisis', value: analysisType },
  ];

  return (
    <section
      className={[
        'rounded-2xl border-2 border-orange-100 bg-[#fffaf6] p-5 shadow-[0_10px_20px_rgba(249,115,22,0.08)]',
        className ?? '',
      ].join(' ')}
    >
      <p className="text-xs uppercase tracking-[0.14em] text-orange-600">Ayuda contextual</p>
      <h3 className="mt-1 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">
        La informacion completa sigue disponible; abre cada punto para ver el detalle.
      </p>
      <div className="mt-4 space-y-2">
        {rows.map((item, index) => (
          <details
            key={item.label}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-3"
            open={index === 0}
          >
            <summary className="cursor-pointer text-sm font-semibold text-slate-900">
              {item.label}
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-800">{item.value}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
