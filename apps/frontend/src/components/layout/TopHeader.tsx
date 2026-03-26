import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { getStoredSession, logoutCompany } from '../../services/auth.service';
import type { SessionUser } from '../../types/auth';

type TopHeaderProps = {
  onOpenMenu: () => void;
};

const titles: Record<string, string> = {
  '/app/estadisticas': 'Dashboard Estrategico',
  '/app/manifiestos': 'Analisis de Manifiestos',
  '/app/telemetria': 'Telemetria GPS',
  '/app/geografia': 'Mapa Interactivo de Colombia',
  '/app/empresas': 'Empresas Habilitadas',
  '/app/portal-empresa': 'Portal Privado Empresarial',
  '/app/descarga-informe': 'Descarga de Informes',
};

export function TopHeader({ onOpenMenu }: TopHeaderProps): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const title = titles[location.pathname] ?? 'TransData RNDC';
  const [session, setSession] = useState<SessionUser | null>(() => getStoredSession());

  useEffect(() => {
    setSession(getStoredSession());
  }, [location.pathname]);

  const onLogout = async (): Promise<void> => {
    await logoutCompany();
    setSession(null);
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-700 bg-slate-900/85 px-4 py-4 backdrop-blur md:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-md border border-slate-700 px-2 py-1 text-slate-200 md:hidden"
            onClick={onOpenMenu}
            aria-label="Abrir menu"
          >
            Menu
          </button>
          <div>
            <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
            <p className="text-xs text-slate-400">Operacion nacional - Colombia</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <div className="rounded-lg bg-orange-500/10 px-3 py-2 text-xs text-orange-200">
                {session.companyName}
              </div>
              <button
                type="button"
                className="rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:bg-slate-700"
                onClick={() => void onLogout()}
              >
                Cerrar sesion
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-md border border-orange-700/70 bg-orange-900/20 px-3 py-2 text-xs text-orange-200 hover:bg-orange-800/30"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
