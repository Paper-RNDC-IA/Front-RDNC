export const endpoints = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    me: '/api/auth/me',
    logout: '/api/auth/logout',
  },
  manifests: {
    kpis: '/api/manifests/kpis',
    trends: '/api/manifests/trends',
    routeRanking: '/api/manifests/ranking-routes',
    companyRanking: '/api/manifests/ranking-companies',
    distribution: '/api/manifests/distribution',
  },
  telemetry: {
    kpis: '/api/telemetry/kpis',
    speeds: '/api/telemetry/speeds',
    alerts: '/api/telemetry/alerts',
    corridor: '/api/telemetry/corridor',
    securityEvents: '/api/telemetry/security-events',
    upload: '/api/telemetry/upload',
  },
  routes: {
    kpis: '/api/routes/kpis',
    departments: '/api/routes/departments',
    productionMap: '/api/routes/production-map',
    demandMap: '/api/routes/demand-map',
    royaltiesMap: '/api/routes/royalties-map',
  },
  companies: {
    kpis: '/api/companies/kpis',
    list: '/api/companies/list',
    detail: (companyId: string) => `/api/companies/${companyId}`,
  },
  companyPortal: {
    files: '/api/company-files',
    upload: '/api/company-files/upload',
    summary: '/api/company-files/summary',
    detail: (fileId: string) => `/api/company-files/${fileId}`,
    insights: (fileId: string) => `/api/company-files/${fileId}/insights`,
    reports: '/api/company-files/reports',
  },
  stats: {
    kpis: '/api/stats/kpis',
    trends: '/api/stats/trends',
    summary: '/api/stats/summary',
  },
  export: {
    combined: '/api/export/combined',
  },
} as const;
