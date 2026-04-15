type SectionHeaderProps = {
  title: string;
  description?: string;
};

export function SectionHeader({ title, description }: SectionHeaderProps): JSX.Element {
  return (
    <div className="space-y-2 border-l-4 border-orange-300 pl-3">
      <h3 className="text-xl font-semibold leading-tight text-slate-900">{title}</h3>
      {description ? <p className="max-w-3xl text-sm text-slate-600">{description}</p> : null}
    </div>
  );
}
