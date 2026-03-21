import type { DateRange } from '../types/common';
import type { CompaniesDashboardApi, CompanyApi, CompanyKpiApi } from '../types/companies';
import { mockCompanies, mockCompanyKpis } from '../constants/mocks';

import { api, withMockFallback } from './api';
import { endpoints } from './endpoints';

function buildDateQuery(dateRange?: DateRange): Record<string, string> {
  return {
    from: dateRange?.from ?? '',
    to: dateRange?.to ?? '',
  };
}

export function getCompanyKpis(dateRange?: DateRange): Promise<CompanyKpiApi[]> {
  return withMockFallback(
    () => api.get<CompanyKpiApi[]>(endpoints.companies.kpis, buildDateQuery(dateRange)),
    mockCompanyKpis,
  );
}

export function getCompanies(dateRange?: DateRange): Promise<CompanyApi[]> {
  return withMockFallback(
    () => api.get<CompanyApi[]>(endpoints.companies.list, buildDateQuery(dateRange)),
    mockCompanies,
  );
}

export function getCompanyDetail(companyId: string): Promise<CompanyApi> {
  return withMockFallback(
    () => api.get<CompanyApi>(endpoints.companies.detail(companyId)),
    mockCompanies[0],
  );
}

export function getCompaniesDashboard(dateRange?: DateRange): Promise<CompaniesDashboardApi> {
  return withMockFallback(
    async () => {
      const [kpis, companies] = await Promise.all([
        getCompanyKpis(dateRange),
        getCompanies(dateRange),
      ]);

      return { kpis, companies };
    },
    {
      kpis: mockCompanyKpis,
      companies: mockCompanies,
    },
  );
}
