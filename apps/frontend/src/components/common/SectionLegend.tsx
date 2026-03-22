type SectionLegendItem = {
  label: string;
  description: string;
};

type SectionLegendProps = {
  title: string;
  items: SectionLegendItem[];
};

export function SectionLegend({ title, items }: SectionLegendProps): JSX.Element {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2"
          >
            <p className="text-xs font-semibold text-orange-300">{item.label}</p>
            <p className="mt-1 text-xs text-slate-300">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
