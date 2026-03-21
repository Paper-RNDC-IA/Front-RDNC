import type { TrendDirection } from './common';

export type CompanyFileStatus = 'processed' | 'processing' | 'error';

export type CompanyFileApi = {
  id: string;
  file_name: string;
  size_bytes: number;
  uploaded_at: string;
  records: number;
  status: CompanyFileStatus;
  source_module: string;
};

export type CompanyFileSummaryApi = {
  total_files: number;
  total_records: number;
  processed_files: number;
  pending_files: number;
  error_files: number;
  last_upload_at: string | null;
};

export type CompanyInsightKpiApi = {
  label: string;
  value: number;
  delta?: string;
  trend?: TrendDirection;
};

export type CompanyInsightTrendApi = {
  period: string;
  total: number;
};

export type CompanyInsightCategoryApi = {
  label: string;
  total: number;
};

export type CompanyFileInsightApi = {
  file_id: string;
  kpis: CompanyInsightKpiApi[];
  trend: CompanyInsightTrendApi[];
  categories: CompanyInsightCategoryApi[];
  notes: string[];
};

export type CompanyFileUploadApi = {
  file: CompanyFileApi;
};
