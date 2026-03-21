import type { DateRange } from '../types/common';

function toInputDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function getDefaultDateRange(): DateRange {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 30);

  return {
    from: toInputDate(start),
    to: toInputDate(today),
  };
}
