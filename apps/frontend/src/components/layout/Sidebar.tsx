import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { isAuthenticated } from '../../services/auth.service';

type SidebarProps = {
  open: boolean;
  onNavigate: () => void;
};

type NavItem = { to: string; label: string };
type NavGroup = { id: string; title: string; items: NavItem[] };

const EMPRESA_ITEMS: NavItem[] = [
  { to: '/app/portal-empresa', label: 'Mis datos' },
  { to: '/app/mis-archivos', label: 'Mis archivos' },
  { to: '/app/chat-empresa', label: 'Asistente IA' },
  { to: '/app/descarga-informe', label: 'Informes' },
];

const PUBLIC_ITEMS: NavItem[] = [
  { to: '/app/estadisticas', label: 'Estadísticas' },
  { to: '/app/manifiestos', label: 'Manifiestos' },
  { to: '/app/telemetria', label: 'Telemetría' },
  { to: '/app/empresas', label: 'Empresas' },
  { to: '/app/geografia', label: 'Geografía' },
];

const EMPRESA_GROUP: NavGroup = {
  id: 'empresa',
  title: 'Portal Empresarial',
  items: EMPRESA_ITEMS,
};
const PUBLIC_GROUPS: NavGroup[] = [
  { id: 'rndc', title: 'RNDC Público', items: PUBLIC_ITEMS.slice(0, 4) },
  { id: 'geo', title: 'Territorial', items: PUBLIC_ITEMS.slice(4) },
];
const GENERAL_GROUP: NavGroup = {
  id: 'general',
  title: 'General',
  items: [{ to: '/', label: 'Inicio' }],
};

const PUBLIC_PATHS = PUBLIC_ITEMS.map((item) => item.to);

function NavLinkItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }): JSX.Element {
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          'block rounded-lg px-3 py-2.5 transition-colors duration-150',
          isActive
            ? 'bg-white/10 text-white shadow-[inset_3px_0_0_#e42b0c]'
            : 'text-[#b8bfcc] hover:bg-white/5 hover:text-white',
        ].join(' ')
      }
    >
      <p className="text-[15px] font-medium">{item.label}</p>
    </NavLink>
  );
}

function Logo(): JSX.Element {
  return (
    <div className="mb-8 border-b border-white/10 px-1 pb-6">
      <div className="mb-2 flex items-center gap-2">
        <svg
          viewBox="0 0 64 40"
          className="h-7 w-10 text-[#e42b0c]"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="10" width="38" height="22" rx="3" />
          <path d="M40 18h10l8 8v6H40V18z" />
          <circle cx="14" cy="34" r="5" />
          <circle cx="50" cy="34" r="5" />
          <line x1="2" y1="18" x2="40" y2="18" />
        </svg>
        <p className="text-xs font-medium uppercase tracking-[0.025em] text-[#b8bfcc]">
          TransData
        </p>
      </div>
      <h1 className="text-xl font-semibold tracking-tight text-white">RNDC Colombia</h1>
      <p className="mt-0.5 text-xs text-[#8a8a8a]">Análisis de carga terrestre</p>
    </div>
  );
}

export function Sidebar({ open, onNavigate }: SidebarProps): JSX.Element {
  const { pathname } = useLocation();
  const auth = isAuthenticated();
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const [publicOpen, setPublicOpen] = useState(isPublicPath);

  const asideClassName = [
    'fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-y-auto overscroll-contain bg-[#1f1f1f] px-5 py-7 transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 md:w-64',
    open ? 'translate-x-0' : '-translate-x-full',
  ].join(' ');

  if (auth) {
    // Logueado: el portal empresarial es la navegación principal (sin recuadro,
    // son los apartados que más se usan) y los datos públicos del RNDC se
    // agrupan en un solo desplegable, para que no se vea partido en dos bloques.
    return (
      <aside className={asideClassName}>
        <Logo />
        <nav className="flex-1 space-y-4 overflow-y-auto pr-1">
          <div className="space-y-1.5">
            {EMPRESA_ITEMS.map((item) => (
              <NavLinkItem key={item.to} item={item} onNavigate={onNavigate} />
            ))}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setPublicOpen((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[#b8bfcc] transition-colors hover:bg-white/5 hover:text-white"
            >
              <span className="text-xs font-medium uppercase tracking-[0.025em]">
                Datos Públicos RNDC
              </span>
              <svg
                viewBox="0 0 20 20"
                className={`h-4 w-4 transition-transform ${publicOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
              </svg>
            </button>
            {publicOpen ? (
              <div className="mt-1.5 space-y-1.5 pl-1">
                {PUBLIC_ITEMS.map((item) => (
                  <NavLinkItem key={item.to} item={item} onNavigate={onNavigate} />
                ))}
              </div>
            ) : null}
          </div>
        </nav>
      </aside>
    );
  }

  // No logueado: se mantiene la distribución original (General, público, empresa al final).
  const groups: NavGroup[] = [GENERAL_GROUP, ...PUBLIC_GROUPS, EMPRESA_GROUP];

  return (
    <aside className={asideClassName}>
      <Logo />
      <nav className="flex-1 space-y-3 overflow-y-auto pr-1">
        {groups.map((group) => (
          <section key={group.id} className="pb-2 last:pb-0">
            <p className="text-xs font-medium uppercase tracking-[0.025em] text-[#8a8a8a]">{group.title}</p>
            <div className="mt-2 space-y-1.5">
              {group.items.map((item) => (
                <NavLinkItem key={item.to} item={item} onNavigate={onNavigate} />
              ))}
            </div>
          </section>
        ))}
      </nav>
    </aside>
  );
}
