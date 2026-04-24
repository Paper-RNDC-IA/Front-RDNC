type DataSourceBadgeProps = {
  module: string;
  sourceLabel?: string;
  sourceDetail?: string;
  visibility?: 'public' | 'private' | 'hybrid' | 'internal';
  updatedAt?: string;
};

const visibilityLabel: Record<NonNullable<DataSourceBadgeProps['visibility']>, string> = {
  public: 'Publico',
  private: 'Privado',
  hybrid: 'Hibrido',
  internal: 'Interno',
};

export function DataSourceBadge({
  module,
  sourceLabel,
  sourceDetail,
  visibility = 'public',
  updatedAt,
}: DataSourceBadgeProps): JSX.Element {
  return (
    <div className="rounded-[16px] border border-[#d4ddee] bg-white px-4 py-3 shadow-[0_8px_18px_rgba(21,51,96,0.06)]">
      <div className="flex flex-wrap items-center gap-2 text-sm text-[#375889]">
        <span className="rounded-full border border-[#f0c79f] bg-[#fff5ea] px-2.5 py-0.5 text-xs font-semibold text-[#d16c11]">
          {visibilityLabel[visibility]}
        </span>
        <span className="font-semibold text-[#1a3c69]">{module}</span>
        {sourceLabel ? <span className="text-[#57719a]">• {sourceLabel}</span> : null}
        {updatedAt ? <span className="text-[#57719a]">• {updatedAt}</span> : null}
      </div>
      {sourceDetail ? <p className="mt-1 text-xs text-[#667fa6]">{sourceDetail}</p> : null}
    </div>
  );
}
