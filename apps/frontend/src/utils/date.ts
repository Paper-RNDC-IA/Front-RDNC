import type { DateRange } from '../types/common';

const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function toInputDate(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function normalizeDateInput(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  const normalizedSeparators = trimmed.replace(/\//g, '-');
  const directMatch = normalizedSeparators.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (directMatch) {
    const [, year, month, day] = directMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  const isoPrefix = normalizedSeparators.match(/^(\d{4}-\d{2}-\d{2})T/);
  if (isoPrefix) {
    return isoPrefix[1];
  }

  return normalizedSeparators;
}

export function normalizeDateRange(dateRange: DateRange): DateRange {
  return {
    from: normalizeDateInput(dateRange.from),
    to: normalizeDateInput(dateRange.to),
  };
}

function isValidCalendarDate(value: string): boolean {
  if (!DATE_FORMAT_REGEX.test(value)) {
    return false;
  }

  const [yearRaw, monthRaw, dayRaw] = value.split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

export function getDateRangeValidationError(dateRange: DateRange): string | null {
  const normalized = normalizeDateRange(dateRange);

  if (!normalized.from && !normalized.to) {
    return null;
  }

  if (!isValidCalendarDate(normalized.from) || !isValidCalendarDate(normalized.to)) {
    return 'Formato invalido: usar YYYY-MM-DD.';
  }

  if (normalized.from > normalized.to) {
    return 'Rango invalido: la fecha inicial debe ser menor o igual a la final.';
  }

  return null;
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
