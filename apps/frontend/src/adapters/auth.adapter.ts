import type { LoginResponseApi, SessionUser } from '../types/auth';

export function adaptSession(
  response: LoginResponseApi,
  fallback?: Pick<SessionUser, 'token' | 'expiresAt'>,
): SessionUser {
  return {
    token: response.access_token ?? fallback?.token ?? '',
    companyId: response.company_id,
    companyName: response.company_name,
    companyNit: response.company_nit ?? 'N/A',
    email: response.email,
    expiresAt: response.expires_at ?? fallback?.expiresAt ?? '',
  };
}
