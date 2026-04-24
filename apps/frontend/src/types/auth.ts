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
  token_type?: 'bearer';
  company_id: string;
  company_name: string;
  company_nit?: string;
  email: string;
  expires_at?: string;
};

export type SessionUser = {
  token: string;
  companyId: string;
  companyName: string;
  companyNit: string;
  email: string;
  expiresAt: string;
};
