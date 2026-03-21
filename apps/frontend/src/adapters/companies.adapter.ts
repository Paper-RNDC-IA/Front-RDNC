import type { KpiItem } from '../types/common';
import type { CompanyApi, CompanyKpiApi } from '../types/companies';
import { formatNumber, formatPercent } from '../utils/formatters';

export type CompanyRow = {
  id: string;
  name: string;
  nit: string;
  activeVehicles: string;
  compliance: string;
  city: string;
  status: string;
};

export function adaptCompanyKpis(items: CompanyKpiApi[]): KpiItem[] {
  return items.map((item) => ({
    label: item.label,
    value: formatNumber(item.value),
    delta: item.delta,
    trend: item.trend,
  }));
}

export function adaptCompanyRows(items: CompanyApi[]): CompanyRow[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    nit: item.nit,
    activeVehicles: formatNumber(item.active_vehicles),
    compliance: formatPercent(item.compliance / 100),
    city: item.city ?? 'Sin ciudad',
    status: item.status ?? 'Activa',
  }));
}

export function adaptCompanyDetail(item: CompanyApi | null): CompanyRow | null {
  if (!item) {
    return null;
  }

  return {
    id: item.id,
    name: item.name,
    nit: item.nit,
    activeVehicles: formatNumber(item.active_vehicles),
    compliance: formatPercent(item.compliance / 100),
    city: item.city ?? 'Sin ciudad',
    status: item.status ?? 'Activa',
  };
}
