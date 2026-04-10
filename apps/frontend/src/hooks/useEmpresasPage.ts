import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  adaptCompanyDetail,
  adaptCompanyKpis,
  adaptCompanyRows,
  type CompanyRow,
} from '../adapters/companies.adapter';
import { getCompanies, getCompanyDetail, getCompanyKpis } from '../services/companies.service';
import type { DateRange, KpiItem } from '../types/common';
import { getDefaultDateRange } from '../utils/date';

type EmpresasPageState = {
  loading: boolean;
  error: string | null;
  dateRange: DateRange;
  kpis: KpiItem[];
  companies: CompanyRow[];
  selectedCompany: CompanyRow | null;
};

export function useEmpresasPage() {
  const [state, setState] = useState<EmpresasPageState>({
    loading: true,
    error: null,
    dateRange: getDefaultDateRange(),
    kpis: [],
    companies: [],
    selectedCompany: null,
  });

  const load = useCallback(async (dateRange: DateRange) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [kpiRes, companiesRes] = await Promise.all([
        getCompanyKpis(dateRange),
        getCompanies(dateRange),
      ]);

      const companies = adaptCompanyRows(companiesRes);
      const firstCompanyId = companies[0]?.id;
      const detailRes = firstCompanyId ? await getCompanyDetail(firstCompanyId) : null;

      setState((prev) => ({
        ...prev,
        loading: false,
        kpis: adaptCompanyKpis(kpiRes),
        companies,
        selectedCompany: adaptCompanyDetail(detailRes),
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error inesperado en empresas',
      }));
    }
  }, []);

  useEffect(() => {
    void load(state.dateRange);
  }, [load, state.dateRange]);

  const setDateRange = useCallback((dateRange: DateRange) => {
    setState((prev) => ({ ...prev, dateRange }));
  }, []);

  const setSelectedCompany = useCallback(async (companyId: string) => {
    const detail = await getCompanyDetail(companyId);
    setState((prev) => ({ ...prev, selectedCompany: adaptCompanyDetail(detail) }));
  }, []);

  const reload = useCallback(() => {
    void load(state.dateRange);
  }, [load, state.dateRange]);

  return useMemo(
    () => ({
      loading: state.loading,
      error: state.error,
      dateRange: state.dateRange,
      kpis: state.kpis,
      companies: state.companies,
      selectedCompany: state.selectedCompany,
      setDateRange,
      setSelectedCompany,
      reload,
    }),
    [reload, setDateRange, setSelectedCompany, state],
  );
}
