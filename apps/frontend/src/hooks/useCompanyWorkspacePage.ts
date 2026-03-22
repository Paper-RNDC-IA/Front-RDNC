import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  adaptCompanyFiles,
  adaptCompanySummary,
  adaptInsightCategories,
  adaptInsightKpis,
  adaptInsightNotes,
  adaptInsightRows,
  adaptInsightTrend,
  type CompanyFileRow,
} from '../adapters/company-portal.adapter';
import { getCurrentSession } from '../services/auth.service';
import {
  deleteCompanyFile,
  getCompanyFileInsight,
  getCompanyFiles,
  getCompanyFilesSummary,
  uploadCompanyFile,
} from '../services/company-portal.service';
import type { SessionUser } from '../types/auth';
import type { CompanyFileApi, CompanyFileInsightApi } from '../types/company-portal';
import type { ChartDatum, KpiItem, SummaryItem } from '../types/common';
import { exportRowsToCsv, exportRowsToExcel, exportSectionToPdf } from '../utils/exports';

type WorkspaceState = {
  loading: boolean;
  insightLoading: boolean;
  uploading: boolean;
  deletingFileId: string | null;
  error: string | null;
  session: SessionUser | null;
  files: CompanyFileApi[];
  fileRows: CompanyFileRow[];
  summaryKpis: KpiItem[];
  selectedFileId: string | null;
  selectedFileName: string | null;
  insight: CompanyFileInsightApi | null;
  insightKpis: KpiItem[];
  insightTrend: ChartDatum[];
  insightCategories: ChartDatum[];
  insightNotes: SummaryItem[];
  insightRows: Array<Record<string, string | number>>;
};

const initialState: WorkspaceState = {
  loading: true,
  insightLoading: false,
  uploading: false,
  deletingFileId: null,
  error: null,
  session: null,
  files: [],
  fileRows: [],
  summaryKpis: [],
  selectedFileId: null,
  selectedFileName: null,
  insight: null,
  insightKpis: [],
  insightTrend: [],
  insightCategories: [],
  insightNotes: [],
  insightRows: [],
};

function createExportBaseName(session: SessionUser | null, selectedFileId: string | null): string {
  const dateTag = new Date().toISOString().slice(0, 10);
  const companyTag = session?.companyId ?? 'empresa';
  const fileTag = selectedFileId ?? 'sin-archivo';

  return `portal-empresarial-${companyTag}-${fileTag}-${dateTag}`;
}

export function useCompanyWorkspacePage() {
  const [state, setState] = useState<WorkspaceState>(initialState);

  const loadInsightForFile = useCallback(async (session: SessionUser, fileId: string) => {
    setState((prev) => ({ ...prev, insightLoading: true, error: null }));

    try {
      const insight = await getCompanyFileInsight(session.companyId, fileId);

      setState((prev) => {
        const selectedRow = prev.fileRows.find((item) => item.id === fileId) ?? null;

        return {
          ...prev,
          insightLoading: false,
          selectedFileId: fileId,
          selectedFileName: selectedRow?.fileName ?? prev.selectedFileName,
          insight,
          insightKpis: adaptInsightKpis(insight),
          insightTrend: adaptInsightTrend(insight),
          insightCategories: adaptInsightCategories(insight),
          insightNotes: adaptInsightNotes(insight),
          insightRows: adaptInsightRows(insight),
        };
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        insightLoading: false,
        error:
          error instanceof Error ? error.message : 'No fue posible cargar el analisis del archivo.',
      }));
    }
  }, []);

  const loadWorkspace = useCallback(
    async (preferredFileId?: string | null) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const session = await getCurrentSession();

        if (!session) {
          throw new Error('La sesion no esta disponible. Inicia sesion nuevamente.');
        }

        const [files, summary] = await Promise.all([
          getCompanyFiles(session.companyId),
          getCompanyFilesSummary(session.companyId),
        ]);

        const fileRows = adaptCompanyFiles(files);
        const selectedFileId =
          preferredFileId && files.some((item) => item.id === preferredFileId)
            ? preferredFileId
            : (files[0]?.id ?? null);

        setState((prev) => ({
          ...prev,
          loading: false,
          session,
          files,
          fileRows,
          summaryKpis: adaptCompanySummary(summary),
          selectedFileId,
          selectedFileName: fileRows.find((item) => item.id === selectedFileId)?.fileName ?? null,
          insight: null,
          insightKpis: [],
          insightTrend: [],
          insightCategories: [],
          insightNotes: [],
          insightRows: [],
        }));

        if (selectedFileId) {
          await loadInsightForFile(session, selectedFileId);
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Error en portal empresarial.',
        }));
      }
    },
    [loadInsightForFile],
  );

  useEffect(() => {
    void loadWorkspace();
  }, [loadWorkspace]);

  const onUploadFile = useCallback(
    async (file: File) => {
      if (!state.session) {
        return;
      }

      setState((prev) => ({ ...prev, uploading: true, error: null }));

      try {
        const uploaded = await uploadCompanyFile(state.session.companyId, file);
        await loadWorkspace(uploaded.file.id);
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'No fue posible cargar el archivo.',
        }));
      } finally {
        setState((prev) => ({ ...prev, uploading: false }));
      }
    },
    [loadWorkspace, state.session],
  );

  const onDeleteFile = useCallback(
    async (fileId: string) => {
      if (!state.session) {
        return;
      }

      setState((prev) => ({ ...prev, deletingFileId: fileId, error: null }));

      try {
        await deleteCompanyFile(state.session.companyId, fileId);
        const nextSelection = state.selectedFileId === fileId ? null : state.selectedFileId;
        await loadWorkspace(nextSelection);
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'No fue posible eliminar el archivo.',
        }));
      } finally {
        setState((prev) => ({ ...prev, deletingFileId: null }));
      }
    },
    [loadWorkspace, state.selectedFileId, state.session],
  );

  const onSelectFile = useCallback(
    async (fileId: string) => {
      if (!state.session) {
        return;
      }

      await loadInsightForFile(state.session, fileId);
    },
    [loadInsightForFile, state.session],
  );

  const onExportCsv = useCallback(async () => {
    const fileName = `${createExportBaseName(state.session, state.selectedFileId)}.csv`;
    exportRowsToCsv(state.insightRows, fileName);
  }, [state.insightRows, state.selectedFileId, state.session]);

  const onExportExcel = useCallback(async () => {
    const fileName = `${createExportBaseName(state.session, state.selectedFileId)}.xlsx`;
    exportRowsToExcel(state.insightRows, fileName);
  }, [state.insightRows, state.selectedFileId, state.session]);

  const onExportPdf = useCallback(async () => {
    const fileName = `${createExportBaseName(state.session, state.selectedFileId)}.pdf`;
    await exportSectionToPdf('company-insight-panel', fileName);
  }, [state.selectedFileId, state.session]);

  const reload = useCallback(() => {
    void loadWorkspace(state.selectedFileId);
  }, [loadWorkspace, state.selectedFileId]);

  return useMemo(
    () => ({
      loading: state.loading,
      insightLoading: state.insightLoading,
      uploading: state.uploading,
      deletingFileId: state.deletingFileId,
      error: state.error,
      session: state.session,
      fileRows: state.fileRows,
      summaryKpis: state.summaryKpis,
      selectedFileId: state.selectedFileId,
      selectedFileName: state.selectedFileName,
      insightKpis: state.insightKpis,
      insightTrend: state.insightTrend,
      insightCategories: state.insightCategories,
      insightNotes: state.insightNotes,
      onUploadFile,
      onDeleteFile,
      onSelectFile,
      onExportCsv,
      onExportExcel,
      onExportPdf,
      reload,
    }),
    [
      onDeleteFile,
      onExportCsv,
      onExportExcel,
      onExportPdf,
      onSelectFile,
      onUploadFile,
      reload,
      state,
    ],
  );
}
