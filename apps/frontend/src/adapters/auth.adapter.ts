import type { LoginResponseApi, SessionUser } from '../types/auth';

export function adaptSession(response: LoginResponseApi): SessionUser {
  return {
    token: response.access_token,
    companyId: response.company_id,
    companyName: response.company_name,
    companyNit: response.company_nit ?? 'N/A',
    email: response.email,
    expiresAt: response.expires_at,
  };
}
