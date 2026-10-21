import { useCallback, useEffect, useRef, useState } from 'react';

import {
  getEmissionsCorridors,
  getEmissionsMethodology,
  getEmissionsMonthly,
  getEmissionsOverview,
  getEmissionsTerritories,
  getEmissionsTrend,
} from '../services/emissions.service';
import type {
  EmissionsCorridorApi,
  EmissionsMethodologyApi,
  EmissionsMonthApi,
  EmissionsOverviewApi,
  EmissionsTerritoryApi,
  EmissionsTrendItemApi,
} from '../types/emissions';

type EmisionesState = {
  loading: boolean;
  error: string | null;
  anio: number | undefined;
  overview: EmissionsOverviewApi | null;
  trend: EmissionsTrendItemApi[];
  monthly: EmissionsMonthApi[];
  departments: EmissionsTerritoryApi[];
  municipalities: EmissionsTerritoryApi[];
  corridors: EmissionsCorridorApi[];
  methodology: EmissionsMethodologyApi | null;
};

export function useEmisionesPage() {
  const requestIdRef = useRef(0);
  const [state, setState] = useState<EmisionesState>({
    loading: true,
    error: null,
    anio: undefined,
    overview: null,
    trend: [],
    monthly: [],
    departments: [],
    municipalities: [],
    corridors: [],
    methodology: null,
  });

  const load = useCallback(async (anio: number | undefined) => {
    const requestId = ++requestIdRef.current;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const overview = await getEmissionsOverview(anio);
      const year = overview.anio;
      const [trend, monthly, departments, municipalities, corridors, methodology] =
        await Promise.all([
          getEmissionsTrend(),
          getEmissionsMonthly(year),
          getEmissionsTerritories(year, 'departamento', 'origen', 10),
          getEmissionsTerritories(year, 'municipio', 'origen', 10),
          getEmissionsCorridors(year, 10),
          getEmissionsMethodology(),
        ]);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setState({
        loading: false,
        error: null,
        anio: year,
        overview,
        trend,
        monthly,
        departments,
        municipalities,
        corridors,
        methodology,
      });
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return;
      }
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'No fue posible cargar las emisiones.',
      }));
    }
  }, []);

  useEffect(() => {
    void load(undefined);
  }, [load]);

  return {
    ...state,
    setAnio: (anio: number) => void load(anio),
    reload: () => void load(state.anio),
  };
}
