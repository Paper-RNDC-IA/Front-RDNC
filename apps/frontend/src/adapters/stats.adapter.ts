import type { ChartDatum, KpiItem } from '../types/common';
import type { StatsKpiApi, StatsSummaryApi, StatsTrendApi } from '../types/stats';
import { formatNumber } from '../utils/formatters';

export function adaptStatsKpis(items: StatsKpiApi[]): KpiItem[] {
  return items.map((item) => ({
    label: item.label,
    value: formatNumber(item.value),
    delta: item.delta,
    trend: item.trend,
  }));
}

export function adaptStatsTrend(items: StatsTrendApi[]): ChartDatum[] {
  return items.map((item) => ({
    label: item.period,
    value: item.total,
  }));
}

export function adaptStatsSummary(items: StatsSummaryApi[]): ChartDatum[] {
  return items.map((item) => ({
    label: item.module,
    value: item.total,
  }));
}
