import {
  buildCompanyInsight,
  buildCompanySummary,
  mockCompanyFilesSeed,
} from '../constants/company-portal.mocks';
import type {
  CompanyFileApi,
  CompanyFileInsightApi,
  CompanyFileSummaryApi,
  CompanyFileUploadApi,
} from '../types/company-portal';

import { api } from './api';
import { endpoints } from './endpoints';

const COMPANY_FILES_STORAGE_PREFIX = 'transdata-rndc:company-files:';

function getStorageKey(companyId: string): string {
  return `${COMPANY_FILES_STORAGE_PREFIX}${companyId}`;
}

function readStoredFiles(companyId: string): CompanyFileApi[] {
  const key = getStorageKey(companyId);
  const raw = localStorage.getItem(key);

  if (!raw) {
    const initial = mockCompanyFilesSeed[companyId] ?? [];
    localStorage.setItem(key, JSON.stringify(initial));
    return [...initial];
  }

  try {
    const parsed = JSON.parse(raw) as CompanyFileApi[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredFiles(companyId: string, files: CompanyFileApi[]): void {
  localStorage.setItem(getStorageKey(companyId), JSON.stringify(files));
}

function createUploadedMockFile(file: File): CompanyFileApi {
  return {
    id: `file-${Date.now()}`,
    file_name: file.name,
    size_bytes: file.size,
    uploaded_at: new Date().toISOString(),
    records: Math.max(100, Math.round(file.size / 120)),
    status: 'processing',
    source_module: 'carga-interna',
  };
}

export async function getCompanyFiles(companyId: string): Promise<CompanyFileApi[]> {
  try {
    return await api.get<CompanyFileApi[]>(endpoints.companyPortal.files, {
      company_id: companyId,
    });
  } catch {
    return readStoredFiles(companyId);
  }
}

export async function getCompanyFilesSummary(companyId: string): Promise<CompanyFileSummaryApi> {
  try {
    return await api.get<CompanyFileSummaryApi>(endpoints.companyPortal.summary, {
      company_id: companyId,
    });
  } catch {
    const files = readStoredFiles(companyId);
    return buildCompanySummary(files);
  }
}

export async function uploadCompanyFile(
  companyId: string,
  file: File,
): Promise<CompanyFileUploadApi> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('company_id', companyId);

  try {
    return await api.postForm<CompanyFileUploadApi>(endpoints.companyPortal.upload, formData);
  } catch {
    const files = readStoredFiles(companyId);
    const mockFile = createUploadedMockFile(file);
    const updated = [mockFile, ...files];
    writeStoredFiles(companyId, updated);

    return {
      file: mockFile,
    };
  }
}

export async function deleteCompanyFile(companyId: string, fileId: string): Promise<void> {
  try {
    await api.delete(endpoints.companyPortal.detail(fileId));
    return;
  } catch {
    const files = readStoredFiles(companyId);
    const updated = files.filter((file) => file.id !== fileId);
    writeStoredFiles(companyId, updated);
  }
}

export async function getCompanyFileInsight(
  companyId: string,
  fileId: string,
): Promise<CompanyFileInsightApi> {
  try {
    return await api.get<CompanyFileInsightApi>(endpoints.companyPortal.insights(fileId), {
      company_id: companyId,
    });
  } catch {
    const files = readStoredFiles(companyId);
    const file = files.find((item) => item.id === fileId);

    if (!file) {
      throw new Error('No se encontro el archivo para generar analisis.');
    }

    return buildCompanyInsight(file);
  }
}
