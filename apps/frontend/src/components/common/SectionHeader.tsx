type SectionHeaderProps = {
  title: string;
  description?: string;
};

export function SectionHeader({ title, description }: SectionHeaderProps): JSX.Element {
  return (
    <div className="space-y-1 pt-4">
      <h3 className="text-2xl font-normal leading-tight tracking-tight text-[#101828]">{title}</h3>
      {description ? <p className="max-w-3xl text-sm text-slate-600">{description}</p> : null}
    </div>
  );
}
