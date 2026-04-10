import type {
  CompanyFileApi,
  CompanyFileInsightApi,
  CompanyFileSummaryApi,
  CompanyFileUploadApi,
} from '../types/company-portal';

import { api } from './api';
import { endpoints } from './endpoints';

export async function getCompanyFiles(companyId: string): Promise<CompanyFileApi[]> {
  return api.get<CompanyFileApi[]>(endpoints.companyPortal.files, {
    company_id: companyId,
  });
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

  return api.postForm<CompanyFileUploadApi>(
    `${endpoints.companyPortal.upload}?company_id=${encodeURIComponent(companyId)}`,
    formData,
  );
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
