import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  adaptDepartments,
  adaptGeographyKpis,
  type DepartmentView,
} from '../adapters/geography.adapter';
import { getDepartmentIntensity, getRouteKpis } from '../services/routes.service';
import type { DateRange, KpiItem } from '../types/common';
import { getDefaultDateRange } from '../utils/date';

type GeografiaPageState = {
  loading: boolean;
  error: string | null;
  dateRange: DateRange;
  kpis: KpiItem[];
  departments: DepartmentView[];
  selectedDepartment: string | null;
};

export function useGeografiaPage() {
  const [state, setState] = useState<GeografiaPageState>({
    loading: true,
    error: null,
    dateRange: getDefaultDateRange(),
    kpis: [],
    departments: [],
    selectedDepartment: null,
  });

  const load = useCallback(async (dateRange: DateRange) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [kpiRes, departmentsRes] = await Promise.all([
        getRouteKpis(dateRange),
        getDepartmentIntensity(dateRange),
      ]);

      const departments = adaptDepartments(departmentsRes);

      setState((prev) => ({
        ...prev,
        loading: false,
        kpis: adaptGeographyKpis(kpiRes),
        departments,
        selectedDepartment: departments[0]?.department ?? null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error inesperado en geografia',
      }));
    }
  }, []);

  useEffect(() => {
    void load(state.dateRange);
  }, [load, state.dateRange]);

  const setSelectedDepartment = useCallback((department: string) => {
    setState((prev) => ({ ...prev, selectedDepartment: department }));
  }, []);

  const reload = useCallback(() => {
    void load(state.dateRange);
  }, [load, state.dateRange]);

  return useMemo(
    () => ({
      loading: state.loading,
      error: state.error,
      kpis: state.kpis,
      departments: state.departments,
      selectedDepartment: state.selectedDepartment,
      setSelectedDepartment,
      reload,
    }),
    [reload, setSelectedDepartment, state],
  );
}
