export type TrendDirection = 'up' | 'down' | 'neutral';

export type DateRange = {
  from: string;
  to: string;
};

export type KpiItem = {
  label: string;
  value: string | number;
  delta?: string;
  trend?: TrendDirection;
  helperText?: string;
};

export type ChartDatum = {
  label: string;
  value: number;
};

export type SummaryItem = {
  label: string;
  value: string | number;
};

export type ApiError = {
  message: string;
  status?: number;
};

export type AsyncPageState = {
  loading: boolean;
  error: string | null;
};
