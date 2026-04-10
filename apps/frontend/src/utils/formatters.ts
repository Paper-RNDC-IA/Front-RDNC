export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-CO').format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDecimal(value: number, digits = 1): string {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatSpeed(value: number): string {
  return `${formatDecimal(value, 1)} km/h`;
}

export function formatKilometers(value: number): string {
  return `${formatDecimal(value, 1)} km`;
}
