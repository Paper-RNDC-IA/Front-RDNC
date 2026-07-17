import type { LoginResponseApi, SessionUser } from '../types/auth';

export function adaptSession(
  response: LoginResponseApi,
  fallback?: Pick<SessionUser, 'token' | 'expiresAt'>,
): SessionUser {
  const token =
    response.access_token ??
    response.token ??
    fallback?.token ??
    '';

  const companyId = String(
    response.company_id ?? response.company ?? response.empresa_id ?? '',
  );

  const rawName = String(response.company_name ?? response.nombre_empresa ?? '');
  const rawNit  = String(response.company_nit  ?? response.nit ?? '');

  // El back a veces devuelve company_name=NIT y company_nit=nombre (invertidos).
  // Detectamos por patrón: NIT solo tiene dígitos, puntos y guiones.
  const isNitLike = (s: string) => s.length > 0 && /^[\d.-]+$/.test(s.trim());
  const swapped = isNitLike(rawName) && !isNitLike(rawNit);

  const companyName = (swapped ? rawNit : rawName) || companyId || 'Empresa';
  const companyNit  = (swapped ? rawName : rawNit) || 'N/A';

  const email = String(response.email ?? response.correo ?? '');

  // Si el back no devuelve expires_at, ponemos 24h desde ahora para no borrar la sesion
  const expiresAt =
    response.expires_at ??
    (response.exp ? new Date(response.exp * 1000).toISOString() : null) ??
    fallback?.expiresAt ??
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  return { token, companyId, companyName, companyNit, email, expiresAt };
}
