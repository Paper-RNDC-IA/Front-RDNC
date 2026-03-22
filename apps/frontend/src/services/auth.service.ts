import { adaptSession } from '../adapters/auth.adapter';
import {
  buildMockLoginResponse,
  buildMockRegisterResponse,
} from '../constants/company-portal.mocks';
import type {
  LoginRequest,
  LoginResponseApi,
  RegisterCompanyRequest,
  SessionUser,
} from '../types/auth';

import { api } from './api';
import { endpoints } from './endpoints';

const SESSION_STORAGE_KEY = 'transdata-rndc:company-session';

function isExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() <= Date.now();
}

function storeSession(session: SessionUser): void {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function getStoredSession(): SessionUser | null {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as SessionUser;

    if (!parsed.expiresAt || isExpired(parsed.expiresAt)) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getStoredSession());
}

export async function loginCompany(credentials: LoginRequest): Promise<SessionUser> {
  if (!credentials.companyNit || !credentials.email || !credentials.password) {
    throw new Error('Completa NIT, correo y contrasena para ingresar.');
  }

  let response: LoginResponseApi;

  try {
    response = await api.post<LoginResponseApi>(endpoints.auth.login, {
      company_nit: credentials.companyNit,
      email: credentials.email,
      password: credentials.password,
    });
  } catch {
    // TODO: Replace mock fallback when auth endpoint is fully enabled in FastAPI.
    response = buildMockLoginResponse(credentials);
  }

  const session = adaptSession(response);
  storeSession(session);
  return session;
}

export async function registerCompany(payload: RegisterCompanyRequest): Promise<SessionUser> {
  if (!payload.companyName || !payload.companyNit || !payload.email || !payload.password) {
    throw new Error('Completa nombre, NIT, correo y contrasena para registrarte.');
  }

  if (payload.password !== payload.confirmPassword) {
    throw new Error('La confirmacion de contrasena no coincide.');
  }

  let response: LoginResponseApi;

  try {
    response = await api.post<LoginResponseApi>(endpoints.auth.register, {
      company_name: payload.companyName,
      company_nit: payload.companyNit,
      email: payload.email,
      password: payload.password,
    });
  } catch {
    // TODO: Replace mock fallback when register endpoint is fully enabled in FastAPI.
    response = buildMockRegisterResponse(payload);
  }

  const session = adaptSession(response);
  storeSession(session);
  return session;
}

export async function getCurrentSession(): Promise<SessionUser | null> {
  const existingSession = getStoredSession();

  if (!existingSession) {
    return null;
  }

  try {
    const response = await api.get<LoginResponseApi>(endpoints.auth.me);
    const session = adaptSession(response);
    storeSession(session);
    return session;
  } catch {
    return existingSession;
  }
}

export async function logoutCompany(): Promise<void> {
  try {
    await api.post(endpoints.auth.logout);
  } catch {
    // noop on mock mode
  }

  localStorage.removeItem(SESSION_STORAGE_KEY);
}
