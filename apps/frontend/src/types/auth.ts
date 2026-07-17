export type LoginRequest = {
  companyNit: string;
  email: string;
  password: string;
};

export type RegisterCompanyRequest = {
  companyName: string;
  companyNit: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginResponseApi = {
  access_token?: string;
  token?: string;
  token_type?: 'bearer';
  company_id?: string;
  company?: string;
  empresa_id?: string;
  company_name?: string;
  nombre_empresa?: string;
  company_nit?: string;
  nit?: string;
  email?: string;
  correo?: string;
  expires_at?: string;
  exp?: number;
};

export type SessionUser = {
  token: string;
  companyId: string;
  companyName: string;
  companyNit: string;
  email: string;
  expiresAt: string;
};
