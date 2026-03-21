import type { ChartDatum, KpiItem } from '../types/common';
import type {
  CompanyRankingApi,
  ManifestDistributionApi,
  ManifestKpiApi,
  ManifestTrendApi,
  RouteRankingApi,
} from '../types/manifests';
import { formatNumber, formatPercent } from '../utils/formatters';

export function adaptManifestKpis(items: ManifestKpiApi[]): KpiItem[] {
  return items.map((item) => ({
    label: item.label,
    value: formatNumber(item.value),
    delta: item.delta,
    trend: item.trend,
  }));
}

export function adaptManifestTrend(items: ManifestTrendApi[]): ChartDatum[] {
  return items.map((item) => ({
    label: item.period,
    value: item.total,
  }));
}

export function adaptRouteRanking(items: RouteRankingApi[]): Array<Record<string, string | number>> {
  return items.map((item) => ({
    route: item.route,
    trips: formatNumber(item.trips),
    incidents: item.incidents,
  }));
}

export function adaptCompanyRanking(items: CompanyRankingApi[]): Array<Record<string, string | number>> {
  return items.map((item) => ({
    company: item.company,
    manifests: formatNumber(item.manifests),
    compliance: formatPercent(item.compliance / 100),
  }));
}

export function adaptManifestDistribution(items: ManifestDistributionApi[]): ChartDatum[] {
  return items.map((item) => ({
    label: item.status,
    value: item.total,
  }));
}
