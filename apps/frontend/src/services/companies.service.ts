import type { DateRange } from '../types/common';
import type { CompaniesDashboardApi, CompanyApi, CompanyKpiApi } from '../types/companies';

import { api } from './api';
import { endpoints } from './endpoints';

function buildDateQuery(dateRange?: DateRange): Record<string, string> {
  return {
    from: dateRange?.from ?? '',
    to: dateRange?.to ?? '',
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toNumber(value: unknown): number {
  return typeof value === 'number' ? value : Number(value ?? 0);
}

function normalizeCompany(item: unknown): CompanyApi {
  if (!isRecord(item)) {
    return {
      id: '0',
      name: 'Sin nombre',
      nit: 'N/A',
      active_vehicles: 0,
      compliance: 0,
      city: 'Sin ciudad',
      status: 'Sin estado',
    };
  }

  const idRaw = item.id ?? item.company_id ?? item.empresa_id ?? '0';

  return {
    id: String(idRaw),
    name: String(item.name ?? item.nombre ?? 'Sin nombre'),
    nit: String(item.nit ?? item.company_nit ?? 'N/A'),
    active_vehicles: toNumber(item.active_vehicles ?? item.vehiculos_activos),
    compliance: toNumber(item.compliance ?? item.cumplimiento),
    city: String(item.city ?? item.municipio ?? item.departamento ?? 'Sin ciudad'),
    status: String(item.status ?? item.estado ?? 'Activa'),
  };
}

function normalizeCompanies(payload: unknown): CompanyApi[] {
  if (Array.isArray(payload)) {
    return payload.map(normalizeCompany);
  }

  if (!isRecord(payload)) {
    return [];
  }

  const items = Array.isArray(payload.items) ? payload.items : [];
  return items.map(normalizeCompany);
}

function normalizeKpis(payload: unknown): CompanyKpiApi[] {
  if (Array.isArray(payload)) {
    return payload as CompanyKpiApi[];
  }

  if (!isRecord(payload)) {
    return [];
  }

  const porDepartamento = Array.isArray(payload.por_departamento)
    ? payload.por_departamento.length
    : 0;

  return [
    { label: 'Empresas Totales', value: toNumber(payload.total_empresas) },
    { label: 'Empresas Activas', value: toNumber(payload.empresas_activas) },
    { label: 'Departamentos', value: porDepartamento },
  ];
}

export async function getCompaniesList(dateRange?: DateRange): Promise<CompanyApi[]> {
  const response = await api.get<unknown>(endpoints.companies.list, buildDateQuery(dateRange));
  return normalizeCompanies(response);
}

export async function getCompaniesKpis(dateRange?: DateRange): Promise<CompanyKpiApi[]> {
  const response = await api.get<unknown>(endpoints.companies.kpis, buildDateQuery(dateRange));
  return normalizeKpis(response);
}

export async function getCompaniesRanking(dateRange?: DateRange): Promise<CompanyApi[]> {
  const response = await api.get<unknown>(endpoints.companies.ranking, buildDateQuery(dateRange));
  return Array.isArray(response) ? response.map(normalizeCompany) : [];
}

export async function getCompanyKpis(dateRange?: DateRange): Promise<CompanyKpiApi[]> {
  return getCompaniesKpis(dateRange);
}

export async function getCompanies(dateRange?: DateRange): Promise<CompanyApi[]> {
  return getCompaniesList(dateRange);
}

export async function getCompanyDetail(companyId: string): Promise<CompanyApi> {
  const response = await api.get<unknown>(endpoints.companies.detail(companyId));
  return normalizeCompany(response);
}

export async function getCompaniesDashboard(dateRange?: DateRange): Promise<CompaniesDashboardApi> {
  const [kpis, companies] = await Promise.all([getCompanyKpis(dateRange), getCompanies(dateRange)]);
  return { kpis, companies };
}
