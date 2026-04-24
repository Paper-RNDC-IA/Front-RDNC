import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  adaptRouteFiles,
  adaptRouteMapStats,
  adaptRouteMonths,
  adaptRouteVehicles,
  adaptVehicleRouteMap,
} from '../adapters/companyRoutes.adapter';
import {
  getRouteEvents,
  getRouteFiles,
  getRouteMap,
  getRouteMonths,
  getRouteVehicles,
} from '../services/companyRoutes.service';
import type {
  FileOption,
  MonthOption,
  RouteMapFiltersState,
  VehicleOption,
  VehicleRouteMap,
} from '../types/company-routes';

type UseCompanyRoutesParams = {
  companyId: string;
  initialFileId?: string | null;
  enabled?: boolean;
};

type CompanyRoutesState = {
  files: FileOption[];
  vehicles: VehicleOption[];
  months: MonthOption[];
  mapData: VehicleRouteMap | null;
  filters: RouteMapFiltersState;
  loadingFiles: boolean;
  loadingVehicles: boolean;
  loadingMonths: boolean;
  loadingMap: boolean;
  error: string | null;
  refreshTick: number;
};

const initialState: CompanyRoutesState = {
  files: [],
  vehicles: [],
  months: [],
  mapData: null,
  filters: {
    fileId: '',
    vehicleId: '',
    month: '',
  },
  loadingFiles: false,
  loadingVehicles: false,
  loadingMonths: false,
  loadingMap: false,
  error: null,
  refreshTick: 0,
};

export function useCompanyRoutes({
  companyId,
  initialFileId,
  enabled = true,
}: UseCompanyRoutesParams) {
  const [state, setState] = useState<CompanyRoutesState>(initialState);

  useEffect(() => {
    if (!initialFileId) {
      return;
    }

    setState((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        fileId: initialFileId,
      },
    }));
  }, [initialFileId]);

  useEffect(() => {
    if (!enabled || !companyId) {
      return;
    }

    let active = true;

    setState((prev) => ({ ...prev, loadingFiles: true, error: null }));

    void getRouteFiles(companyId)
      .then((response) => {
        if (!active) {
          return;
        }

        const files = adaptRouteFiles(response);

        setState((prev) => {
          const selectedFromCurrent = files.some((item) => item.value === prev.filters.fileId)
            ? prev.filters.fileId
            : '';
          const selectedFromInitial =
            initialFileId && files.some((item) => item.value === initialFileId)
              ? initialFileId
              : '';
          const nextFileId = selectedFromCurrent || selectedFromInitial || files[0]?.value || '';

          return {
            ...prev,
            files,
            loadingFiles: false,
            filters: {
              ...prev.filters,
              fileId: nextFileId,
            },
          };
        });
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setState((prev) => ({
          ...prev,
          loadingFiles: false,
          files: [],
          error: error instanceof Error ? error.message : 'No fue posible cargar archivos.',
        }));
      });

    return () => {
      active = false;
    };
  }, [companyId, enabled, initialFileId, state.refreshTick]);

  useEffect(() => {
    if (!enabled || !companyId || !state.filters.fileId) {
      return;
    }

    let active = true;

    setState((prev) => ({
      ...prev,
      loadingVehicles: true,
      error: null,
      vehicles: [],
      months: [],
      mapData: null,
      filters: {
        ...prev.filters,
        vehicleId: '',
        month: '',
      },
    }));

    void getRouteVehicles({ company_id: companyId, file_id: state.filters.fileId })
      .then((response) => {
        if (!active) {
          return;
        }

        const vehicles = adaptRouteVehicles(response);

        setState((prev) => {
          const nextVehicleId =
            vehicles.length === 1
              ? vehicles[0].value
              : vehicles.some((item) => item.value === prev.filters.vehicleId)
                ? prev.filters.vehicleId
                : '';

          return {
            ...prev,
            vehicles,
            loadingVehicles: false,
            filters: {
              ...prev.filters,
              vehicleId: nextVehicleId,
            },
          };
        });
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setState((prev) => ({
          ...prev,
          loadingVehicles: false,
          vehicles: [],
          error: error instanceof Error ? error.message : 'No fue posible cargar vehiculos.',
        }));
      });

    return () => {
      active = false;
    };
  }, [companyId, enabled, state.filters.fileId]);

  useEffect(() => {
    if (!enabled || !companyId || !state.filters.fileId || !state.filters.vehicleId) {
      return;
    }

    let active = true;

    setState((prev) => ({
      ...prev,
      loadingMonths: true,
      error: null,
      months: [],
      mapData: null,
      filters: {
        ...prev.filters,
        month: '',
      },
    }));

    void getRouteMonths({
      company_id: companyId,
      file_id: state.filters.fileId,
      vehicle_id: state.filters.vehicleId,
    })
      .then((response) => {
        if (!active) {
          return;
        }

        const months = adaptRouteMonths(response);

        setState((prev) => {
          const nextMonth =
            months.length === 1
              ? months[0].value
              : months.some((item) => item.value === prev.filters.month)
                ? prev.filters.month
                : '';

          return {
            ...prev,
            months,
            loadingMonths: false,
            filters: {
              ...prev.filters,
              month: nextMonth,
            },
          };
        });
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setState((prev) => ({
          ...prev,
          loadingMonths: false,
          months: [],
          error: error instanceof Error ? error.message : 'No fue posible cargar meses.',
        }));
      });

    return () => {
      active = false;
    };
  }, [companyId, enabled, state.filters.fileId, state.filters.vehicleId]);

  useEffect(() => {
    if (
      !enabled ||
      !companyId ||
      !state.filters.fileId ||
      !state.filters.vehicleId ||
      !state.filters.month
    ) {
      return;
    }

    let active = true;

    setState((prev) => ({ ...prev, loadingMap: true, error: null, mapData: null }));

    void Promise.all([
      getRouteMap({
        company_id: companyId,
        file_id: state.filters.fileId,
        vehicle_id: state.filters.vehicleId,
        month: state.filters.month,
      }),
      getRouteEvents({
        company_id: companyId,
        file_id: state.filters.fileId,
        vehicle_id: state.filters.vehicleId,
        month: state.filters.month,
      }),
    ])
      .then(([mapResponse, eventsResponse]) => {
        if (!active) {
          return;
        }

        setState((prev) => ({
          ...prev,
          loadingMap: false,
          mapData: adaptVehicleRouteMap(mapResponse, eventsResponse),
        }));
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setState((prev) => ({
          ...prev,
          loadingMap: false,
          mapData: null,
          error: error instanceof Error ? error.message : 'No fue posible cargar el mini mapa.',
        }));
      });

    return () => {
      active = false;
    };
  }, [companyId, enabled, state.filters.fileId, state.filters.vehicleId, state.filters.month]);

  const refresh = useCallback(() => {
    setState((prev) => ({ ...prev, refreshTick: prev.refreshTick + 1 }));
  }, []);

  const setFileId = useCallback((fileId: string) => {
    setState((prev) => ({
      ...prev,
      filters: {
        fileId,
        vehicleId: '',
        month: '',
      },
      vehicles: [],
      months: [],
      mapData: null,
    }));
  }, []);

  const setVehicleId = useCallback((vehicleId: string) => {
    setState((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        vehicleId,
        month: '',
      },
      months: [],
      mapData: null,
    }));
  }, []);

  const setMonth = useCallback((month: string) => {
    setState((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        month,
      },
      mapData: null,
    }));
  }, []);

  const mapStats = useMemo(
    () => (state.mapData ? adaptRouteMapStats(state.mapData) : []),
    [state.mapData],
  );

  const eventsPreview = useMemo(() => state.mapData?.events.slice(0, 8) ?? [], [state.mapData]);
  const isLoading =
    state.loadingFiles || state.loadingVehicles || state.loadingMonths || state.loadingMap;
  const hasReadyFilters = Boolean(
    state.filters.fileId && state.filters.vehicleId && state.filters.month,
  );
  const isMapEmpty =
    hasReadyFilters && !state.loadingMap && (state.mapData?.path.length ?? 0) === 0;

  return {
    files: state.files,
    vehicles: state.vehicles,
    months: state.months,
    filters: state.filters,
    mapData: state.mapData,
    mapStats,
    eventsPreview,
    error: state.error,
    loadingFiles: state.loadingFiles,
    loadingVehicles: state.loadingVehicles,
    loadingMonths: state.loadingMonths,
    loadingMap: state.loadingMap,
    isLoading,
    hasReadyFilters,
    isMapEmpty,
    setFileId,
    setVehicleId,
    setMonth,
    refresh,
  };
}
