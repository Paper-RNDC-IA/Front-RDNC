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
    setDraft({ from: value.from, to: value.to });
  }, [value.from, value.to]);

  const validationMessage = useMemo(() => getDateRangeValidationError(draft), [draft]);

  function handleSearch(): void {
    if (validationMessage) {
      return;
    }

    onChange(draft);
  }

  return (
    <Card title="Filtro por fechas" className="border-[#d2daeb] bg-[#f7f9fe]">
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="space-y-1 text-sm text-[#425f8b]">
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
            className="w-full rounded-lg border border-[#cbd7eb] bg-white px-3 py-2 text-[#1d3d68]"
          />
        </label>
        <label className="space-y-1 text-sm text-[#425f8b]">
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
            className="w-full rounded-lg border border-[#cbd7eb] bg-white px-3 py-2 text-[#1d3d68]"
          />
        </label>
        <button
          type="button"
          onClick={handleSearch}
          className="rounded-full border border-[#ef8e39] bg-[#f07b1b] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#e46e10] focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          Buscar
        </button>
      </div>
      <p className="mt-2 text-xs text-[#627ca3]">
        Los resultados se actualizan cuando presionas Buscar.
      </p>
      {validationMessage ? <p className="mt-1 text-xs text-red-600">{validationMessage}</p> : null}
    </Card>
  );
}
