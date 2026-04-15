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
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_10px_20px_rgba(15,23,42,0.07)]">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-zinc-200 bg-[#fffaf6] px-3 py-2.5"
          >
            <p className="text-xs font-semibold text-orange-700">{item.label}</p>
            <p className="mt-1 text-xs text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
