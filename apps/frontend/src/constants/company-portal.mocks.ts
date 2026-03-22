import type { LoginResponseApi, LoginRequest, RegisterCompanyRequest } from '../types/auth';
import type {
  CompanyFileApi,
  CompanyFileInsightApi,
  CompanyFileSummaryApi,
} from '../types/company-portal';

type MockCompanyUser = {
  companyId: string;
  companyName: string;
  companyNit: string;
  email: string;
  password: string;
};

export const mockCompanyUsers: MockCompanyUser[] = [
  {
    companyId: 'cmp-1',
    companyName: 'Carga Andina SAS',
    companyNit: '901234567-1',
    email: 'admin@cargaandina.com',
    password: 'TransData123*',
  },
  {
    companyId: 'cmp-2',
    companyName: 'Logistica del Norte',
    companyNit: '900987654-0',
    email: 'analitica@lognorte.com',
    password: 'TransData123*',
  },
];

export const mockCompanyFilesSeed: Record<string, CompanyFileApi[]> = {
  'cmp-1': [
    {
      id: 'file-cmp1-001',
      file_name: 'flota_operacion_enero.xlsx',
      size_bytes: 521440,
      uploaded_at: '2026-03-12T14:20:00.000Z',
      records: 1240,
      status: 'processed',
      source_module: 'telemetria',
    },
    {
      id: 'file-cmp1-002',
      file_name: 'manifiestos_q1.csv',
      size_bytes: 344210,
      uploaded_at: '2026-03-14T10:45:00.000Z',
      records: 890,
      status: 'processed',
      source_module: 'manifiestos',
    },
    {
      id: 'file-cmp1-003',
      file_name: 'novedades_ruta_bog_med.xlsx',
      size_bytes: 240030,
      uploaded_at: '2026-03-15T09:10:00.000Z',
      records: 310,
      status: 'processing',
      source_module: 'seguridad',
    },
  ],
  'cmp-2': [
    {
      id: 'file-cmp2-001',
      file_name: 'consolidado_operacion.xlsx',
      size_bytes: 428000,
      uploaded_at: '2026-03-10T08:00:00.000Z',
      records: 1022,
      status: 'processed',
      source_module: 'estadisticas',
    },
  ],
};

export function buildMockLoginResponse(credentials: LoginRequest): LoginResponseApi {
  const user = mockCompanyUsers.find(
    (item) =>
      item.email.toLowerCase() === credentials.email.toLowerCase() &&
      item.companyNit === credentials.companyNit &&
      item.password === credentials.password,
  );

  if (!user) {
    throw new Error('Credenciales invalidas para portal empresarial.');
  }

  const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();

  return {
    access_token: `mock-token-${user.companyId}-${Date.now()}`,
    token_type: 'bearer',
    company_id: user.companyId,
    company_name: user.companyName,
    company_nit: user.companyNit,
    email: user.email,
    expires_at: expiresAt,
  };
}

export function buildMockRegisterResponse(payload: RegisterCompanyRequest): LoginResponseApi {
  const emailTaken = mockCompanyUsers.some(
    (item) => item.email.toLowerCase() === payload.email.toLowerCase(),
  );
  const nitTaken = mockCompanyUsers.some((item) => item.companyNit === payload.companyNit);

  if (emailTaken) {
    throw new Error('El correo ya esta registrado para otra empresa.');
  }

  if (nitTaken) {
    throw new Error('El NIT ya se encuentra registrado.');
  }

  const companyId = `cmp-${Date.now()}`;

  mockCompanyUsers.push({
    companyId,
    companyName: payload.companyName,
    companyNit: payload.companyNit,
    email: payload.email,
    password: payload.password,
  });

  if (!mockCompanyFilesSeed[companyId]) {
    mockCompanyFilesSeed[companyId] = [];
  }

  return {
    access_token: `mock-token-${companyId}-${Date.now()}`,
    token_type: 'bearer',
    company_id: companyId,
    company_name: payload.companyName,
    company_nit: payload.companyNit,
    email: payload.email,
    expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
  };
}

export function buildCompanySummary(files: CompanyFileApi[]): CompanyFileSummaryApi {
  const totalFiles = files.length;
  const totalRecords = files.reduce((acc, file) => acc + file.records, 0);
  const processedFiles = files.filter((file) => file.status === 'processed').length;
  const pendingFiles = files.filter((file) => file.status === 'processing').length;
  const errorFiles = files.filter((file) => file.status === 'error').length;
  const lastUpload =
    files.map((file) => file.uploaded_at).sort((a, b) => (a > b ? -1 : 1))[0] ?? null;

  return {
    total_files: totalFiles,
    total_records: totalRecords,
    processed_files: processedFiles,
    pending_files: pendingFiles,
    error_files: errorFiles,
    last_upload_at: lastUpload,
  };
}

export function buildCompanyInsight(file: CompanyFileApi): CompanyFileInsightApi {
  const base = Math.max(file.records, 100);

  return {
    file_id: file.id,
    kpis: [
      {
        label: 'Registros procesados',
        value: file.records,
        delta: '+3.2%',
        trend: 'up',
      },
      {
        label: 'Cumplimiento validacion',
        value: Math.round((file.records * 0.93) / 10),
        delta: '+1.1%',
        trend: 'up',
      },
      {
        label: 'Anomalias detectadas',
        value: Math.max(1, Math.round(file.records * 0.04)),
        delta: '-0.7%',
        trend: 'down',
      },
      {
        label: 'Cobertura registros',
        value: Math.round((file.records * 0.88) / 10),
        delta: '+2.8%',
        trend: 'up',
      },
    ],
    trend: [
      { period: 'Semana 1', total: Math.round(base * 0.18) },
      { period: 'Semana 2', total: Math.round(base * 0.22) },
      { period: 'Semana 3', total: Math.round(base * 0.28) },
      { period: 'Semana 4', total: Math.round(base * 0.32) },
    ],
    categories: [
      { label: 'Conformes', total: Math.round(base * 0.74) },
      { label: 'Con alerta', total: Math.round(base * 0.18) },
      { label: 'Criticos', total: Math.round(base * 0.08) },
    ],
    notes: [
      'Se detecta concentracion de eventos en el corredor principal.',
      'Revisar campos de origen y destino para registros incompletos.',
      'La tendencia semanal muestra incremento sostenido de actividad.',
    ],
  };
}
