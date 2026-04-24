import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { getStoredSession, logoutCompany } from '../../services/auth.service';
import type { SessionUser } from '../../types/auth';

type TopHeaderProps = {
  onOpenMenu: () => void;
};

const routeMeta: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Panorama General del Proyecto',
    subtitle: 'Objetivo, alcance y ruta recomendada para evaluacion academica',
  },
  '/app/estadisticas': {
    title: 'Datos Publicos RNDC: Estadisticas',
    subtitle: 'Indicadores nacionales agregados del transporte de carga',
  },
  '/app/manifiestos': {
    title: 'Datos Publicos RNDC: Manifiestos',
    subtitle: 'Volumen, corredores y actores con mayor actividad reportada',
  },
  '/app/telemetria': {
    title: 'Zona Privada Empresarial: Telemetria GPS',
    subtitle: 'Analisis de velocidad, alertas y seguridad desde archivos empresariales',
  },
  '/app/geografia': {
    title: 'Inteligencia Territorial y Mapas',
    subtitle: 'Distribucion por departamento para produccion, demanda y regalias',
  },
  '/app/empresas': {
    title: 'Datos Publicos RNDC: Empresas',
    subtitle: 'Comparativo de empresas habilitadas y su cumplimiento',
  },
  '/app/portal-empresa': {
    title: 'Portal Privado de Empresa',
    subtitle: 'Carga Excel, historico de archivos y reportes internos',
  },
  '/app/descarga-informe': {
    title: 'Centro de Informes y Exportacion',
    subtitle: 'Salida de resultados para seguimiento y sustentacion',
  },
};

export function TopHeader({ onOpenMenu }: TopHeaderProps): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const headerMeta = routeMeta[location.pathname] ?? {
    title: 'TransData RNDC',
    subtitle: 'Monitoreo del transporte de carga terrestre en Colombia',
  };
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
    <header className="sticky relative top-0 z-30 border-b-2 border-zinc-200 bg-white/95 px-4 py-3 shadow-[0_6px_16px_rgba(15,23,42,0.06)] backdrop-blur sm:px-5 sm:py-4 md:px-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-orange-300 via-orange-500 to-orange-300 opacity-90" />
      <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
        <div className="flex min-w-0 items-start gap-2 sm:items-center sm:gap-3">
          <button
            type="button"
            className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-slate-700 md:hidden"
            onClick={onOpenMenu}
            aria-label="Abrir menu"
          >
            Menu
          </button>
          <div className="min-w-0 border-l-4 border-orange-400 pl-3">
            <h2 className="text-xl font-semibold leading-tight text-slate-900 sm:text-2xl">
              {headerMeta.title}
            </h2>
            <p className="mt-1 text-xs text-slate-600 sm:text-sm">{headerMeta.subtitle}</p>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          {session ? (
            <>
              <div className="rounded-full border border-orange-300 bg-orange-50 px-2.5 py-1.5 text-xs font-semibold text-orange-700 shadow-sm sm:px-3">
                {session.companyName}
              </div>
              <button
                type="button"
                className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-zinc-100"
                onClick={() => void onLogout()}
              >
                Cerrar sesion
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-md border border-orange-300 bg-orange-50 px-3 py-2 text-xs font-medium text-orange-700 hover:bg-orange-100"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
