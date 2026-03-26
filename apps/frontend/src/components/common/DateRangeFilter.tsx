import type { DateRange } from '../../types/common';
import { Card } from './Card';

type DateRangeFilterProps = {
  value: DateRange;
  onChange: (value: DateRange) => void;
};

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps): JSX.Element {
  return (
    <Card title="Filtro por fechas">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-300">
          <span>Desde</span>
          <input
            type="date"
            value={value.from}
            onChange={(event) => onChange({ ...value, from: event.target.value })}
            className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
          />
        </label>
        <label className="space-y-1 text-sm text-slate-300">
          <span>Hasta</span>
          <input
            type="date"
            value={value.to}
            onChange={(event) => onChange({ ...value, to: event.target.value })}
            className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
          />
        </label>
      </div>
    </Card>
  );
}
