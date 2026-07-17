import type {
  CompanyFileApi,
  CompanyFileInsightApi,
  CompanyFileSummaryApi,
  CompanyFileUploadApi,
} from '../types/company-portal';

import { api } from './api';
import { endpoints } from './endpoints';

export async function getCompanyFiles(companyId: string): Promise<CompanyFileApi[]> {
  const response = await api.get<unknown>(endpoints.companyPortal.files, {
    company_id: companyId,
  });

  if (Array.isArray(response)) {
    return response as CompanyFileApi[];
  }

  if (response && typeof response === 'object') {
    const rec = response as Record<string, unknown>;
    const nested = rec.files ?? rec.data ?? rec.items ?? rec.results;
    if (Array.isArray(nested)) {
      return nested as CompanyFileApi[];
    }
  }

  return [];
}

export async function getCompanyFilesSummary(companyId: string): Promise<CompanyFileSummaryApi> {
  return api.get<CompanyFileSummaryApi>(endpoints.companyPortal.summary, {
    company_id: companyId,
  });
}

export async function uploadCompanyFile(
  companyId: string,
  file: File,
): Promise<CompanyFileUploadApi> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.postForm<unknown>(
    `${endpoints.companyPortal.upload}?company_id=${encodeURIComponent(companyId)}`,
    formData,
  );

  if (response && typeof response === 'object') {
    const rec = response as Record<string, unknown>;

    // Backend devuelve { file: { id, ... } }
    if (rec.file && typeof rec.file === 'object') {
      return response as CompanyFileUploadApi;
    }

    // Backend devuelve el archivo directamente { id, file_name, ... }
    if (rec.id !== undefined && rec.id !== null) {
      return { file: { ...rec, id: String(rec.id) } as unknown as CompanyFileApi };
    }

    // Backend devuelve { file_id: '...' } u otro shape con referencia al id
    const fileId = rec.file_id ?? rec.id;
    if (fileId !== undefined && fileId !== null) {
      return { file: { id: String(fileId) } as CompanyFileApi };
    }
  }

  throw new Error('El servidor no devolvio un archivo valido tras la carga.');
}

export async function deleteCompanyFile(companyId: string, fileId: string): Promise<void> {
  void companyId;
  await api.delete(endpoints.companyPortal.detail(fileId));
}

export async function getCompanyFileInsight(
  companyId: string,
  fileId: string,
): Promise<CompanyFileInsightApi> {
  return api.get<CompanyFileInsightApi>(endpoints.companyPortal.insights(fileId), {
    company_id: companyId,
  });
}
