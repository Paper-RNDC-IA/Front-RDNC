import { useEffect, useMemo, useState } from 'react';

import type { DateRange } from '../../types/common';
import { getDateRangeValidationError, normalizeDateInput } from '../../utils/date';
import { Card } from './Card';

type DateRangeFilterProps = {
  value: DateRange;
  onChange: (value: DateRange) => void;
};

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps): JSX.Element {
  const [draft, setDraft] = useState<DateRange>(value);

  useEffect(() => {
    setDraft(value);
  }, [value.from, value.to]);

  const validationMessage = useMemo(() => getDateRangeValidationError(draft), [draft]);

  function handleSearch(): void {
    if (validationMessage) {
      return;
    }

    onChange(draft);
  }

  return (
    <Card title="Filtro por fechas">
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="space-y-1 text-sm text-slate-700">
          <span>Desde</span>
          <input
            type="date"
            value={draft.from}
            onChange={(event) =>
              setDraft({
                ...draft,
                from: normalizeDateInput(event.target.value),
              })
            }
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-slate-900"
          />
        </label>
        <label className="space-y-1 text-sm text-slate-700">
          <span>Hasta</span>
          <input
            type="date"
            value={draft.to}
            onChange={(event) =>
              setDraft({
                ...draft,
                to: normalizeDateInput(event.target.value),
              })
            }
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-slate-900"
          />
        </label>
        <button
          type="button"
          onClick={handleSearch}
          className="rounded-md border border-orange-500 bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          Buscar
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Los resultados se actualizan cuando presionas Buscar.
      </p>
      {validationMessage ? <p className="mt-1 text-xs text-red-600">{validationMessage}</p> : null}
    </Card>
  );
}
