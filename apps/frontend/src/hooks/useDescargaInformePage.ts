import { useCallback, useEffect, useMemo, useState } from 'react';

import { adaptExportSummary } from '../adapters/export.adapter';
import { getCombinedExport } from '../services/export.service';
import type { DateRange, SummaryItem } from '../types/common';
import type { ExportModule } from '../types/export';
import {
  exportRowsToCsv,
  exportRowsToExcel,
  exportSectionToPdf,
  toExportFileName,
} from '../utils/exports';
import { getDefaultDateRange } from '../utils/date';

type DescargaInformePageState = {
  loading: boolean;
  error: string | null;
  dateRange: DateRange;
  summary: SummaryItem[];
  rows: Record<string, string | number>[];
};

export function useDescargaInformePage(module: string) {
  const [state, setState] = useState<DescargaInformePageState>({
    loading: true,
    error: null,
    dateRange: getDefaultDateRange(),
    summary: [],
    rows: [],
  });

  const load = useCallback(async (selectedModule: ExportModule, dateRange: DateRange) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await getCombinedExport(selectedModule, dateRange);

      setState((prev) => ({
        ...prev,
        loading: false,
        summary: adaptExportSummary(response),
        rows: response.rows,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error inesperado en exportacion',
      }));
    }
  }, []);

  useEffect(() => {
    void load(module as ExportModule, state.dateRange);
  }, [load, module, state.dateRange]);

  const setDateRange = useCallback((dateRange: DateRange) => {
    setState((prev) => ({ ...prev, dateRange }));
  }, []);

  const exportCsv = useCallback(async () => {
    exportRowsToCsv(state.rows, toExportFileName(module, state.dateRange, 'csv'));
  }, [module, state.dateRange, state.rows]);

  const exportExcel = useCallback(async () => {
    exportRowsToExcel(state.rows, toExportFileName(module, state.dateRange, 'xlsx'));
  }, [module, state.dateRange, state.rows]);

  const exportPdf = useCallback(async () => {
    await exportSectionToPdf('root', toExportFileName(module, state.dateRange, 'pdf'));
  }, [module, state.dateRange]);

  const reload = useCallback(() => {
    void load(module as ExportModule, state.dateRange);
  }, [load, module, state.dateRange]);

  return useMemo(
    () => ({
      loading: state.loading,
      error: state.error,
      dateRange: state.dateRange,
      summary: state.summary,
      setDateRange,
      exportCsv,
      exportExcel,
      exportPdf,
      reload,
    }),
    [exportCsv, exportExcel, exportPdf, reload, setDateRange, state],
  );
}
