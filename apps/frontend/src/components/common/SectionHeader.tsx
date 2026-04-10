type SectionHeaderProps = {
  title: string;
  description?: string;
};

export function SectionHeader({ title, description }: SectionHeaderProps): JSX.Element {
  return (
    <div className="space-y-1">
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      {description ? <p className="text-sm text-slate-400">{description}</p> : null}
    </div>
  );
}
